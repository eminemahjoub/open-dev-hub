import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Validation schema for status updates
const updateOnboardingSchema = z.object({
  status: z.enum(['PENDING', 'REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED']).optional(),
  statusNotes: z.string().optional(),
})

// GET /api/onboarding/[id] - Get specific onboarding request
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const onboardingRequest = await prisma.onboardingRequest.findUnique({
      where: { id: params.id },
      include: {
        fintech: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            category: true,
            website: true,
          }
        }
      }
    })

    if (!onboardingRequest) {
      return NextResponse.json(
        { error: 'Onboarding request not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(onboardingRequest)
  } catch (error) {
    console.error('Error fetching onboarding request:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// PUT /api/onboarding/[id] - Update onboarding request status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = updateOnboardingSchema.parse(body)

    // Check if onboarding request exists
    const existingRequest = await prisma.onboardingRequest.findUnique({
      where: { id: params.id },
      include: {
        fintech: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      }
    })

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Onboarding request not found' },
        { status: 404 }
      )
    }

    // Update onboarding request
    const updatedRequest = await prisma.onboardingRequest.update({
      where: { id: params.id },
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

    // Send status update email if status changed
    if (validatedData.status && validatedData.status !== existingRequest.status) {
      try {
        let subject = ''
        let html = ''

        switch (validatedData.status) {
          case 'REVIEW':
            subject = `Application Under Review - ${existingRequest.fintech.name}`
            html = `
              <h2>Application Under Review</h2>
              <p>Dear ${existingRequest.contactName},</p>
              <p>Your application to ${existingRequest.fintech.name} is now under review.</p>
              <p>We will contact you with updates shortly.</p>
              ${validatedData.statusNotes ? `<p><strong>Notes:</strong> ${validatedData.statusNotes}</p>` : ''}
              <p>Best regards,<br>The EklFounder Team</p>
            `
            break
          case 'APPROVED':
            subject = `Application Approved - ${existingRequest.fintech.name}`
            html = `
              <h2>Application Approved! 🎉</h2>
              <p>Dear ${existingRequest.contactName},</p>
              <p>Congratulations! Your application to ${existingRequest.fintech.name} has been approved.</p>
              <p>The institution will contact you directly within the next 24-48 hours to proceed with the onboarding process.</p>
              ${validatedData.statusNotes ? `<p><strong>Next Steps:</strong> ${validatedData.statusNotes}</p>` : ''}
              <p>Best regards,<br>The EklFounder Team</p>
            `
            break
          case 'REJECTED':
            subject = `Application Update - ${existingRequest.fintech.name}`
            html = `
              <h2>Application Update</h2>
              <p>Dear ${existingRequest.contactName},</p>
              <p>Thank you for your application to ${existingRequest.fintech.name}.</p>
              <p>Unfortunately, your application was not approved at this time.</p>
              ${validatedData.statusNotes ? `<p><strong>Reason:</strong> ${validatedData.statusNotes}</p>` : ''}
              <p>We encourage you to explore other institutions in our directory that might be a better fit for your business.</p>
              <p>Best regards,<br>The EklFounder Team</p>
            `
            break
          case 'COMPLETED':
            subject = `Onboarding Complete - ${existingRequest.fintech.name}`
            html = `
              <h2>Onboarding Complete! ✅</h2>
              <p>Dear ${existingRequest.contactName},</p>
              <p>Your onboarding with ${existingRequest.fintech.name} has been completed successfully.</p>
              <p>You should now have full access to their services.</p>
              ${validatedData.statusNotes ? `<p><strong>Additional Information:</strong> ${validatedData.statusNotes}</p>` : ''}
              <p>We hope you have a great experience with ${existingRequest.fintech.name}!</p>
              <p>Best regards,<br>The EklFounder Team</p>
            `
            break
        }

        if (subject && html) {
          await resend.emails.send({
            from: 'noreply@eklfounder.com',
            to: existingRequest.contactEmail,
            subject,
            html
          })
        }
      } catch (emailError) {
        console.error('Error sending status update email:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json(updatedRequest)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating onboarding request:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// DELETE /api/onboarding/[id] - Delete onboarding request
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if onboarding request exists
    const existingRequest = await prisma.onboardingRequest.findUnique({
      where: { id: params.id }
    })

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Onboarding request not found' },
        { status: 404 }
      )
    }

    // Delete the onboarding request
    await prisma.onboardingRequest.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Onboarding request deleted successfully' })
  } catch (error) {
    console.error('Error deleting onboarding request:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 