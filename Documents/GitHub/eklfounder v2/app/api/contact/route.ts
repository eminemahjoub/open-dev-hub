import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Validation schema for contact form
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  company: z.string().optional(),
  phone: z.string().optional(),
})

// POST /api/contact - Handle contact form submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = contactSchema.parse(body)

    // Send email to admin
    try {
      await resend.emails.send({
        from: 'noreply@eklfounder.com',
        to: process.env.ADMIN_EMAIL || 'admin@eklfounder.com',
        subject: `Contact Form: ${validatedData.subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${validatedData.name}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          ${validatedData.company ? `<p><strong>Company:</strong> ${validatedData.company}</p>` : ''}
          ${validatedData.phone ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>` : ''}
          <p><strong>Subject:</strong> ${validatedData.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>Sent from EklFounder contact form</small></p>
        `,
        reply_to: validatedData.email
      })
    } catch (emailError) {
      console.error('Error sending contact email:', emailError)
      return NextResponse.json(
        { error: 'Failed to send message. Please try again later.' },
        { status: 500 }
      )
    }

    // Send confirmation email to user
    try {
      await resend.emails.send({
        from: 'noreply@eklfounder.com',
        to: validatedData.email,
        subject: 'Message Received - EklFounder',
        html: `
          <h2>Thank you for contacting us!</h2>
          <p>Dear ${validatedData.name},</p>
          <p>We have received your message and will respond within 24 hours.</p>
          <p><strong>Your message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Subject:</strong> ${validatedData.subject}</p>
            <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
          </div>
          <p>Best regards,<br>The EklFounder Team</p>
        `
      })
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError)
      // Don't fail the request if confirmation email fails
    }

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 