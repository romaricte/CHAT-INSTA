import type { NextAuthConfig } from "next-auth"
import { z } from "zod"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import Credentials from "next-auth/providers/credentials"

export const authConfig = {
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials)

          if (!parsedCredentials.success) {
            return null
          }

          const { email, password } = parsedCredentials.data
          const user = await db.user.findUnique({
            where: { email: email.toLowerCase() },
          })

          if (!user || !user.hashedPassword) return null

          const passwordsMatch = await bcrypt.compare(password, user.hashedPassword)

          if (!passwordsMatch) return null

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/register",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name
        session.user.image = token.picture as string | null
      }
      return session
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAuthPage = nextUrl.pathname.startsWith("/login") || 
                          nextUrl.pathname.startsWith("/register")

      if (isLoggedIn && isOnAuthPage) {
        return Response.redirect(new URL("/chat", nextUrl))
      }

      if (!isLoggedIn && !isOnAuthPage && !nextUrl.pathname.startsWith("/api")) {
        return Response.redirect(new URL("/login", nextUrl))
      }

      return true
    }
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig
