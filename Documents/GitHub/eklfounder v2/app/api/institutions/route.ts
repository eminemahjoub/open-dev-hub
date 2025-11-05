import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema
const createInstitutionSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  logo: z.string().optional(),
  description: z.string().min(1),
  website: z.string().url().optional(),
  monthlyFee: z.number().optional(),
  setupFee: z.number().optional(),
  transactionFees: z.string().optional(),
  countries: z.array(z.string()),
  supportedCurrencies: z.array(z.string()).optional(),
  category: z.enum(['EMI', 'BANK', 'PSP', 'CRYPTO', 'OTHER']),
  acceptedRisk: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  minTurnover: z.number().optional(),
  isPartner: z.boolean().default(false),
  isVerified: z.boolean().default(false),
  isRecommended: z.boolean().default(false),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().min(0).default(0),
  requiredDocuments: z.array(z.string()).optional(),
})

// GET /api/institutions - Get all institutions with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const query = searchParams.get('query')
    const category = searchParams.get('category')
    const countries = searchParams.get('countries')?.split(',')
    const riskLevel = searchParams.get('riskLevel')
    const isPartner = searchParams.get('isPartner')
    const minRating = searchParams.get('minRating')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: any = {
      isActive: true
    }

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.category = category
    }

    if (countries && countries.length > 0) {
      where.countries = {
        hasSome: countries
      }
    }

    if (riskLevel) {
      where.acceptedRisk = riskLevel
    }

    if (isPartner) {
      where.isPartner = isPartner === 'true'
    }

    if (minRating) {
      where.rating = {
        gte: parseFloat(minRating)
      }
    }

    // Calculate offset
    const offset = (page - 1) * limit

    // Get institutions with pagination
    const [institutions, total] = await Promise.all([
      prisma.fintech.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder as 'asc' | 'desc'
        },
        skip: offset,
        take: limit,
      }),
      prisma.fintech.count({ where })
    ])

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    return NextResponse.json({
      data: institutions,
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
    console.error('Error fetching institutions:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// POST /api/institutions - Create new institution
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = createInstitutionSchema.parse(body)

    // Check if slug already exists
    const existingInstitution = await prisma.fintech.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingInstitution) {
      return NextResponse.json(
        { error: 'Institution with this slug already exists' },
        { status: 400 }
      )
    }

    // Create institution
    const institution = await prisma.fintech.create({
      data: validatedData
    })

    return NextResponse.json(institution, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating institution:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 