import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "./db";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { serverEnv } from "./env";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(credentials.password, user.password);

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        if (user.role !== "admin") {
          throw new Error("Access denied: Not an administrator");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        if (session.user) {
          (session.user as any).id = token.id;
          (session.user as any).role = token.role;
          session.user.email = token.email as string;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: serverEnv.nextAuthSecret,
};
