import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// Super Admin configuration
// To configure the Super Admin, set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD
// in your .env.local file.
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'admin@arkanum-akademie.de';
const SUPER_ADMIN_PASSWORD_HASH = process.env.SUPER_ADMIN_PASSWORD_HASH || '';
const SUPER_ADMIN_NAME = process.env.SUPER_ADMIN_NAME || 'Super Administrator';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'E-Mail', type: 'email' },
        password: { label: 'Passwort', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const emailLower = credentials.email.toLowerCase();

        // Check super admin first (env-configured, no DB required)
        if (emailLower === SUPER_ADMIN_EMAIL.toLowerCase()) {
          const plainFallback = process.env.SUPER_ADMIN_PLAIN_PASSWORD;
          let passwordValid = false;

          if (SUPER_ADMIN_PASSWORD_HASH) {
            passwordValid = await bcrypt.compare(credentials.password, SUPER_ADMIN_PASSWORD_HASH);
          } else if (plainFallback && process.env.NODE_ENV !== 'production') {
            passwordValid = credentials.password === plainFallback;
          }

          if (!passwordValid) return null;

          return {
            id: 'superadmin-1',
            name: SUPER_ADMIN_NAME,
            email: SUPER_ADMIN_EMAIL,
            role: 'admin',
          };
        }

        // Check database for regular users
        const dbUser = await prisma.user.findUnique({
          where: { email: emailLower },
        });

        if (!dbUser || !dbUser.passwordHash) {
          return null;
        }

        const passwordValid = await bcrypt.compare(credentials.password, dbUser.passwordHash);
        if (!passwordValid) {
          return null;
        }

        return {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = ((user as { role?: string }).role) ?? 'member';
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
