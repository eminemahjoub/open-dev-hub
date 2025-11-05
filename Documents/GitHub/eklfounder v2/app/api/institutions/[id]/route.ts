import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for updates
const updateInstitutionSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  logo: z.string().optional(),
  description: z.string().min(1).optional(),
  website: z.string().url().optional(),
  monthlyFee: z.number().optional(),
  setupFee: z.number().optional(),
  transactionFees: z.string().optional(),
  countries: z.array(z.string()).optional(),
  supportedCurrencies: z.array(z.string()).optional(),
  category: z.enum(['EMI', 'BANK', 'PSP', 'CRYPTO', 'OTHER']).optional(),
  acceptedRisk: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  minTurnover: z.number().optional(),
  isPartner: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  isRecommended: z.boolean().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().min(0).optional(),
  requiredDocuments: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
})

// GET /api/institutions/[id] - Get institution by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const institution = await prisma.fintech.findUnique({
      where: { id: params.id },
      include: {
        onboardingRequests: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            contactName: true,
            companyName: true,
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!institution) {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(institution)
  } catch (error) {
    console.error('Error fetching institution:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// PUT /api/institutions/[id] - Update institution
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = updateInstitutionSchema.parse(body)

    // Check if institution exists
    const existingInstitution = await prisma.fintech.findUnique({
      where: { id: params.id }
    })

    if (!existingInstitution) {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      )
    }

    // Check if slug is being updated and if it conflicts
    if (validatedData.slug && validatedData.slug !== existingInstitution.slug) {
      const slugConflict = await prisma.fintech.findUnique({
        where: { slug: validatedData.slug }
      })

      if (slugConflict) {
        return NextResponse.json(
          { error: 'Institution with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Update institution
    const updatedInstitution = await prisma.fintech.update({
      where: { id: params.id },
      data: validatedData
    })

    return NextResponse.json(updatedInstitution)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating institution:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// DELETE /api/institutions/[id] - Delete institution (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if institution exists
    const existingInstitution = await prisma.fintech.findUnique({
      where: { id: params.id }
    })

    if (!existingInstitution) {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      )
    }

    // Soft delete by setting isActive to false
    await prisma.fintech.update({
      where: { id: params.id },
      data: { isActive: false }
    })

    return NextResponse.json({ message: 'Institution deleted successfully' })
  } catch (error) {
    console.error('Error deleting institution:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 