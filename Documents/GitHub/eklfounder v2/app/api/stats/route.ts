import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    // Get current date for monthly calculations
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Get all statistics in parallel
    const [
      totalFintechs,
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      completedRequests,
      monthlyRequests,
      lastMonthRequests,
      totalNewsletterSubscribers,
      activeNewsletterSubscribers,
      monthlyNewsletterSignups,
      popularFintechs,
      recentRequests,
      requestsByStatus,
      requestsByMonth
    ] = await Promise.all([
      // Total counts
      prisma.fintech.count({ where: { isActive: true } }),
      prisma.onboardingRequest.count(),
      prisma.onboardingRequest.count({ where: { status: 'PENDING' } }),
      prisma.onboardingRequest.count({ where: { status: 'APPROVED' } }),
      prisma.onboardingRequest.count({ where: { status: 'REJECTED' } }),
      prisma.onboardingRequest.count({ where: { status: 'COMPLETED' } }),
      
      // Monthly comparisons
      prisma.onboardingRequest.count({
        where: { createdAt: { gte: startOfMonth } }
      }),
      prisma.onboardingRequest.count({
        where: {
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      }),

      // Newsletter statistics
      prisma.newsletter.count(),
      prisma.newsletter.count({ where: { isActive: true } }),
      prisma.newsletter.count({
        where: { subscribedAt: { gte: startOfMonth } }
      }),

      // Popular institutions (most onboarding requests)
      prisma.fintech.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: { onboardingRequests: true }
          }
        },
        orderBy: {
          onboardingRequests: {
            _count: 'desc'
          }
        },
        take: 5
      }),

      // Recent requests
      prisma.onboardingRequest.findMany({
        include: {
          fintech: {
            select: {
              name: true,
              logo: true,
              category: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Requests by status for chart
      prisma.onboardingRequest.groupBy({
        by: ['status'],
        _count: {
          status: true
        }
      }),

      // Requests by month for trend chart (last 6 months)
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*)::integer as count
        FROM "onboarding_requests"
        WHERE "createdAt" >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 months')
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month ASC
      `
    ])

    // Calculate growth percentage
    const requestGrowth = lastMonthRequests > 0 
      ? ((monthlyRequests - lastMonthRequests) / lastMonthRequests) * 100 
      : monthlyRequests > 0 ? 100 : 0

    // Format popular fintechs
    const formattedPopularFintechs = popularFintechs.map(fintech => ({
      id: fintech.id,
      name: fintech.name,
      slug: fintech.slug,
      logo: fintech.logo,
      category: fintech.category,
      requestCount: fintech._count.onboardingRequests,
      rating: fintech.rating,
      isPartner: fintech.isPartner
    }))

    // Format status distribution
    const statusDistribution = requestsByStatus.reduce((acc: any, item) => {
      acc[item.status.toLowerCase()] = item._count.status
      return acc
    }, {})

    const stats = {
      overview: {
        totalFintechs,
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        completedRequests,
        monthlyRequests,
        requestGrowth: Math.round(requestGrowth * 100) / 100,
        totalNewsletterSubscribers,
        activeNewsletterSubscribers,
        monthlyNewsletterSignups
      },
      popularFintechs: formattedPopularFintechs,
      recentRequests: recentRequests.map(request => ({
        id: request.id,
        companyName: request.companyName,
        contactName: request.contactName,
        contactEmail: request.contactEmail,
        status: request.status,
        createdAt: request.createdAt,
        fintech: request.fintech
      })),
      charts: {
        statusDistribution,
        monthlyTrends: requestsByMonth,
        conversionRate: totalRequests > 0 
          ? Math.round((approvedRequests / totalRequests) * 100 * 100) / 100 
          : 0
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 