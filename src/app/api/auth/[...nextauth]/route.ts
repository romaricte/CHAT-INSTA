import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
})

import { GET, POST } from "@/auth"

export { GET, POST }