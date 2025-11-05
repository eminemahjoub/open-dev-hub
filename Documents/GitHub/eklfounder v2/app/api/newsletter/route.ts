import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Validation schema for newsletter subscription
const newsletterSchema = z.object({
  email: z.string().email('Valid email is required'),
})

// POST /api/newsletter - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = newsletterSchema.parse(body)

    // Check if email already exists
    const existingSubscriber = await prisma.newsletter.findUnique({
      where: { email: validatedData.email }
    })

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { message: 'Email already subscribed to newsletter' },
          { status: 200 }
        )
      } else {
        // Reactivate subscription
        await prisma.newsletter.update({
          where: { email: validatedData.email },
          data: { isActive: true }
        })
        
        return NextResponse.json(
          { message: 'Newsletter subscription reactivated!' },
          { status: 200 }
        )
      }
    }

    // Create new subscription
    await prisma.newsletter.create({
      data: {
        email: validatedData.email,
        isActive: true,
      }
    })

    // Send welcome email
    try {
      await resend.emails.send({
        from: 'noreply@eklfounder.com',
        to: validatedData.email,
        subject: 'Welcome to EklFounder Newsletter!',
        html: `
          <h2>Welcome to EklFounder! 🎉</h2>
          <p>Thank you for subscribing to our newsletter!</p>
          <p>You'll now receive:</p>
          <ul>
            <li>📊 Weekly fintech industry insights</li>
            <li>🏦 New institution partnerships</li>
            <li>💡 Business banking tips and guides</li>
            <li>🚀 Platform updates and new features</li>
          </ul>
          <p>Stay tuned for valuable content to help you find the perfect fintech solutions for your business.</p>
          <hr>
          <p><small>Don't want to receive these emails? <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(validatedData.email)}">Unsubscribe here</a></small></p>
          <p>Best regards,<br>The EklFounder Team</p>
        `
      })
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError)
      // Don't fail the request if welcome email fails
    }

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter!' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// GET /api/newsletter - Get newsletter subscribers (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const isActive = searchParams.get('isActive')

    // Build where clause
    const where: any = {}
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true'
    }

    // Calculate offset
    const offset = (page - 1) * limit

    // Get subscribers with pagination
    const [subscribers, total] = await Promise.all([
      prisma.newsletter.findMany({
        where,
        orderBy: { subscribedAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.newsletter.count({ where })
    ])

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    return NextResponse.json({
      data: subscribers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev
      }
    })
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 