import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
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
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
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
    async signIn({ user, account }) {
      // Handle Google OAuth: create user if not exists, or link existing account
      if (account?.provider === 'google' && user.email) {
        const emailLower = user.email.toLowerCase();
        const existingUser = await prisma.user.findUnique({
          where: { email: emailLower },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              name: user.name || emailLower.split('@')[0],
              email: emailLower,
              emailVerified: new Date(),
              avatar: user.image ?? null,
            },
          });
        } else if (!existingUser.emailVerified) {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { emailVerified: new Date() },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === 'google' && user.email) {
          // Fetch DB user to get our internal id and role
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email.toLowerCase() },
          });
          token.role = dbUser?.role ?? 'member';
          token.id = dbUser?.id ?? user.id;
        } else {
          // Credentials login – user object already carries role and id
          token.role = ((user as { role?: string }).role) ?? 'member';
          token.id = user.id;
        }
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
