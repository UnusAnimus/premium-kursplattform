import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// Super Admin and default users
// To configure the Super Admin, set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD
// in your .env.local file.
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'admin@arkanum-akademie.de';
const SUPER_ADMIN_PASSWORD_HASH = process.env.SUPER_ADMIN_PASSWORD_HASH || '';
const SUPER_ADMIN_NAME = process.env.SUPER_ADMIN_NAME || 'Super Administrator';

// Simple in-memory user store. Replace with a real database in production.
const users = [
  {
    id: 'superadmin-1',
    name: SUPER_ADMIN_NAME,
    email: SUPER_ADMIN_EMAIL,
    role: 'admin' as const,
    passwordHash: SUPER_ADMIN_PASSWORD_HASH,
  },
];

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

        const user = users.find(
          (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
        );

        if (!user) {
          return null;
        }

        // If no password hash is set (first run), allow login with the
        // SUPER_ADMIN_PLAIN_PASSWORD env variable (dev convenience only).
        const plainFallback = process.env.SUPER_ADMIN_PLAIN_PASSWORD;
        let passwordValid = false;

        if (user.passwordHash) {
          passwordValid = await bcrypt.compare(credentials.password, user.passwordHash);
        } else if (plainFallback && user.role === 'admin' && process.env.NODE_ENV !== 'production') {
          passwordValid = credentials.password === plainFallback;
        }

        if (!passwordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
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
