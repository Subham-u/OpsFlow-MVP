import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"

export const authConfig: NextAuthOptions = {
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      return session
    },
    async jwt({ token, user }) {
      return token
    }
  }
}

export const { auth, signIn, signOut } = NextAuth(authConfig) 