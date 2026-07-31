import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id as string
        token.status = user.status as string
        token.permissions = user.permissions as string[]
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
        session.user.status = token.status as string
        session.user.permissions = token.permissions as string[]
      }
      return session
    },
  },
} satisfies NextAuthConfig
