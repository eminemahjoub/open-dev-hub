import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Validation schema for onboarding requests
const createOnboardingSchema = z.object({
  fintechId: z.string().min(1),
  contactEmail: z.string().email(),
  contactName: z.string().min(1),
  contactPhone: z.string().optional(),
  companyName: z.string().min(1),
  companyType: z.string().min(1),
  companyRegistration: z.string().optional(),
  companyAddress: z.string().min(1),
  companyCountry: z.string().min(1),
  estimatedTurnover: z.number().min(0),
  businessDescription: z.string().min(1),
  documents: z.any().optional(),
})

// GET /api/onboarding - Get all onboarding requests with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const status = searchParams.get('status')
    const fintechId = searchParams.get('fintechId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (fintechId) {
      where.fintechId = fintechId
    }

    // Calculate offset
    const offset = (page - 1) * limit

    // Get onboarding requests with pagination
    const [requests, total] = await Promise.all([
      prisma.onboardingRequest.findMany({
        where,
        include: {
          fintech: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
              category: true,
            }
          }
        },
        orderBy: {
          [sortBy]: sortOrder as 'asc' | 'desc'
        },
        skip: offset,
        take: limit,
      }),
      prisma.onboardingRequest.count({ where })
    ])

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    return NextResponse.json({
      data: requests,
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
    console.error('Error fetching onboarding requests:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// POST /api/onboarding - Create new onboarding request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = createOnboardingSchema.parse(body)

    // Check if fintech exists
    const fintech = await prisma.fintech.findUnique({
      where: { id: validatedData.fintechId },
      select: { id: true, name: true, isActive: true }
    })

    if (!fintech || !fintech.isActive) {
      return NextResponse.json(
        { error: 'Institution not found or inactive' },
        { status: 400 }
      )
    }

    // Create onboarding request
    const onboardingRequest = await prisma.onboardingRequest.create({
      data: validatedData,
      include: {
        fintech: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          }
        }
      }
    })

    // Send notification email to admin
    try {
      await resend.emails.send({
        from: 'noreply@eklfounder.com',
        to: process.env.ADMIN_EMAIL || 'admin@eklfounder.com',
        subject: `New Onboarding Request - ${validatedData.companyName}`,
        html: `
          <h2>New Onboarding Request</h2>
          <p><strong>Company:</strong> ${validatedData.companyName}</p>
          <p><strong>Institution:</strong> ${fintech.name}</p>
          <p><strong>Contact:</strong> ${validatedData.contactName} (${validatedData.contactEmail})</p>
          <p><strong>Estimated Turnover:</strong> €${validatedData.estimatedTurnover.toLocaleString()}</p>
          <p><strong>Business Description:</strong> ${validatedData.businessDescription}</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin">View in Admin Dashboard</a></p>
        `
      })
    } catch (emailError) {
      console.error('Error sending notification email:', emailError)
      // Don't fail the request if email fails
    }

    // Send confirmation email to applicant
    try {
      await resend.emails.send({
        from: 'noreply@eklfounder.com',
        to: validatedData.contactEmail,
        subject: `Application Received - ${fintech.name}`,
        html: `
          <h2>Application Received</h2>
          <p>Dear ${validatedData.contactName},</p>
          <p>Thank you for your application to ${fintech.name} through EklFounder.</p>
          <p>We have received your application and it is currently being reviewed. You will receive updates on the status via this email address.</p>
          <p><strong>Application ID:</strong> ${onboardingRequest.id}</p>
          <p><strong>Next Steps:</strong> Our team will review your application and the institution will be notified. You can expect to hear back within 3-5 business days.</p>
          <p>Best regards,<br>The EklFounder Team</p>
        `
      })
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(onboardingRequest, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating onboarding request:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 