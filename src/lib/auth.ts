import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { sql } from '@vercel/postgres'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (!user.email) {
          return false
        }

        // Check if user exists in our users table
        const { rows } = await sql`
          SELECT id FROM users WHERE email = ${user.email}
        `

        if (rows.length === 0) {
          // Create new user
          await sql`
            INSERT INTO users (email, username) 
            VALUES (${user.email}, ${user.name || user.email.split('@')[0]})
          `
        }

        return true
      } catch (error) {
        console.error('Error in signIn callback:', error)
        return false
      }
    },
    async session({ session, token }) {
      try {
        if (session.user?.email) {
          // Get user ID from database
          const { rows } = await sql`
            SELECT id, username FROM users WHERE email = ${session.user.email}
          `

          if (rows.length > 0) {
            session.user.id = rows[0].id
            session.user.name = rows[0].username
          }
        }
        return session
      } catch (error) {
        console.error('Error in session callback:', error)
        return session
      }
    },
  },
}
