import NextAuth from 'next-auth'
import { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM || 'noreply@eklfounder.com',
      async sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from },
      }) {
        try {
          await resend.emails.send({
            from: 'noreply@eklfounder.com',
            to: email,
            subject: 'Sign in to EklFounder Admin',
            html: `
              <h2>Sign in to EklFounder Admin</h2>
              <p>Click the link below to sign in to your admin account:</p>
              <p><a href="${url}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Sign In</a></p>
              <p>If you did not request this email, you can safely ignore it.</p>
              <p>This link will expire in 24 hours.</p>
            `
          })
        } catch (error) {
          console.error('Error sending verification email:', error)
          throw new Error('Failed to send verification email')
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile, email }) {
      // Only allow admin emails to sign in
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@eklfounder.com'
      const allowedEmails = [adminEmail, 'sadok@eklfounder.com'] // Add more admin emails as needed
      
      if (user.email && allowedEmails.includes(user.email)) {
        return true
      }
      
      return false // Deny access for non-admin emails
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = 'admin'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/auth/signin',
    error: '/admin/auth/error',
    verifyRequest: '/admin/auth/verify-request',
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`Admin sign in: ${user.email}`)
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 