import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { slugify } from '@/lib/utils'

// Validation schema for blog posts
const createBlogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()),
  author: z.string().min(1),
  publishedAt: z.string().datetime().optional(),
  isPublished: z.boolean().default(false),
  locale: z.enum(['EN', 'FR']).default('EN'),
})

// GET /api/blog - Get all blog posts with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const query = searchParams.get('query')
    const category = searchParams.get('category')
    const locale = searchParams.get('locale')
    const isPublished = searchParams.get('isPublished')
    const featured = searchParams.get('featured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'publishedAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: any = {}

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } }
      ]
    }

    if (category && category !== 'All') {
      where.category = category
    }

    if (locale) {
      where.locale = locale
    }

    if (isPublished !== null && isPublished !== undefined) {
      where.isPublished = isPublished === 'true'
    }

    // For public API calls, only show published posts
    if (!isPublished) {
      where.isPublished = true
      where.publishedAt = {
        lte: new Date()
      }
    }

    // Calculate offset
    const offset = (page - 1) * limit

    // Get blog posts with pagination
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder as 'asc' | 'desc'
        },
        skip: offset,
        take: limit,
      }),
      prisma.blogPost.count({ where })
    ])

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    return NextResponse.json({
      data: posts,
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
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// POST /api/blog - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = createBlogSchema.parse(body)

    // Generate slug if not provided
    if (!validatedData.slug) {
      validatedData.slug = slugify(validatedData.title)
    }

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingPost) {
      // Add a number suffix to make it unique
      const timestamp = Date.now()
      validatedData.slug = `${validatedData.slug}-${timestamp}`
    }

    // Convert publishedAt string to Date if provided
    const postData: any = { ...validatedData }
    if (validatedData.publishedAt) {
      postData.publishedAt = new Date(validatedData.publishedAt)
    } else if (validatedData.isPublished) {
      postData.publishedAt = new Date()
    }

    // Create blog post
    const post = await prisma.blogPost.create({
      data: postData
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 