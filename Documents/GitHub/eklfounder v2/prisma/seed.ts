import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@eklfounder.com' },
    update: {},
    create: {
      email: 'admin@eklfounder.com',
      name: 'Admin User',
      role: 'SUPER_ADMIN',
      isActive: true,
    }
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create sample fintech institutions
  const institutions = [
    {
      name: 'Revolut Business',
      slug: 'revolut-business',
      logo: '🏦',
      description: 'Global business banking with multi-currency accounts and competitive FX rates. Revolut Business offers comprehensive financial solutions for modern businesses.',
      website: 'https://business.revolut.com',
      monthlyFee: 25,
      setupFee: 0,
      transactionFees: '0.5% per transaction',
      countries: ['UK', 'EU', 'US'],
      supportedCurrencies: ['USD', 'EUR', 'GBP'],
      category: 'EMI' as const,
      acceptedRisk: 'MEDIUM' as const,
      minTurnover: 50000,
      isPartner: true,
      isVerified: true,
      isRecommended: true,
      rating: 4.8,
      reviewCount: 1250,
      requiredDocuments: ['passport', 'company_registration', 'bank_statement', 'proof_of_address']
    },
    {
      name: 'Wise Business',
      slug: 'wise-business',
      logo: '💰',
      description: 'International business banking with real exchange rates and low fees. Perfect for businesses that operate globally.',
      website: 'https://wise.com/business',
      monthlyFee: 0,
      setupFee: 0,
      transactionFees: '0.4% per transaction',
      countries: ['UK', 'EU', 'US', 'AU'],
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'AUD'],
      category: 'EMI' as const,
      acceptedRisk: 'LOW' as const,
      minTurnover: 25000,
      isPartner: true,
      isVerified: true,
      isRecommended: true,
      rating: 4.9,
      reviewCount: 2100,
      requiredDocuments: ['passport', 'company_registration', 'bank_statement']
    },
    {
      name: 'Stripe',
      slug: 'stripe',
      logo: '💳',
      description: 'Payment processing platform for online businesses with global reach. Industry-leading payment infrastructure.',
      website: 'https://stripe.com',
      monthlyFee: 0,
      setupFee: 0,
      transactionFees: '2.9% + 30¢ per transaction',
      countries: ['Global'],
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
      category: 'PSP' as const,
      acceptedRisk: 'MEDIUM' as const,
      minTurnover: 100000,
      isPartner: false,
      isVerified: true,
      isRecommended: true,
      rating: 4.7,
      reviewCount: 3200,
      requiredDocuments: ['company_registration', 'bank_statement', 'proof_of_address']
    },
    {
      name: 'Adyen',
      slug: 'adyen',
      logo: '🔄',
      description: 'End-to-end payment platform for enterprise businesses. Comprehensive payment solutions for large-scale operations.',
      website: 'https://adyen.com',
      monthlyFee: 0,
      setupFee: 1000,
      transactionFees: 'Custom pricing',
      countries: ['Global'],
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY', 'CNY'],
      category: 'PSP' as const,
      acceptedRisk: 'HIGH' as const,
      minTurnover: 1000000,
      isPartner: true,
      isVerified: true,
      isRecommended: false,
      rating: 4.6,
      reviewCount: 890,
      requiredDocuments: ['company_registration', 'bank_statement', 'proof_of_address', 'business_license']
    },
    {
      name: 'Monzo Business',
      slug: 'monzo-business',
      logo: '🏧',
      description: 'UK-based digital bank with innovative solutions for small and medium businesses. Modern banking made simple.',
      website: 'https://monzo.com/business',
      monthlyFee: 5,
      setupFee: 0,
      transactionFees: 'Free domestic transfers',
      countries: ['UK'],
      supportedCurrencies: ['GBP'],
      category: 'BANK' as const,
      acceptedRisk: 'LOW' as const,
      minTurnover: 10000,
      isPartner: false,
      isVerified: true,
      isRecommended: false,
      rating: 4.4,
      reviewCount: 678,
      requiredDocuments: ['passport', 'company_registration', 'proof_of_address']
    },
    {
      name: 'Square',
      slug: 'square',
      logo: '⬜',
      description: 'Complete commerce platform with payment processing. Perfect for retail and e-commerce businesses.',
      website: 'https://squareup.com',
      monthlyFee: 0,
      setupFee: 0,
      transactionFees: '2.9% per transaction',
      countries: ['US', 'CA', 'AU', 'UK'],
      supportedCurrencies: ['USD', 'CAD', 'AUD', 'GBP'],
      category: 'PSP' as const,
      acceptedRisk: 'MEDIUM' as const,
      minTurnover: 75000,
      isPartner: true,
      isVerified: true,
      isRecommended: true,
      rating: 4.5,
      reviewCount: 1890,
      requiredDocuments: ['company_registration', 'bank_statement']
    },
    {
      name: 'Payoneer',
      slug: 'payoneer',
      logo: '🌐',
      description: 'Global payment platform for freelancers and businesses. Specializing in cross-border payments.',
      website: 'https://payoneer.com',
      monthlyFee: 12,
      setupFee: 0,
      transactionFees: '1.5% per transaction',
      countries: ['Global'],
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY'],
      category: 'PSP' as const,
      acceptedRisk: 'MEDIUM' as const,
      minTurnover: 50000,
      isPartner: false,
      isVerified: true,
      isRecommended: false,
      rating: 4.3,
      reviewCount: 2450,
      requiredDocuments: ['passport', 'company_registration', 'bank_statement']
    },
    {
      name: 'Coinbase Commerce',
      slug: 'coinbase-commerce',
      logo: '₿',
      description: 'Cryptocurrency payment processor for businesses. Accept Bitcoin and other cryptocurrencies.',
      website: 'https://commerce.coinbase.com',
      monthlyFee: 0,
      setupFee: 0,
      transactionFees: '1% per transaction',
      countries: ['US', 'EU', 'UK'],
      supportedCurrencies: ['BTC', 'ETH', 'USDC', 'USD'],
      category: 'CRYPTO' as const,
      acceptedRisk: 'HIGH' as const,
      minTurnover: 100000,
      isPartner: false,
      isVerified: true,
      isRecommended: false,
      rating: 4.2,
      reviewCount: 567,
      requiredDocuments: ['company_registration', 'bank_statement', 'kyc_documents']
    }
  ]

  for (const institution of institutions) {
    const created = await prisma.fintech.upsert({
      where: { slug: institution.slug },
      update: institution,
      create: institution
    })
    console.log(`✅ Institution created/updated: ${created.name}`)
  }

  // Create sample blog posts
  const blogPosts = [
    {
      title: 'Complete Guide to EMI Licensing in Europe',
      slug: 'emi-licensing-guide-europe',
      excerpt: 'Everything you need to know about Electronic Money Institution licensing in the European Union.',
      content: `# Complete Guide to EMI Licensing in Europe

## Introduction

Electronic Money Institutions (EMIs) play a crucial role in the modern financial ecosystem...

## Licensing Requirements

### Capital Requirements
- Initial capital of €350,000
- Ongoing capital requirements based on business volume

### Application Process
1. Prepare documentation
2. Submit application to regulator
3. Regulatory review (6-12 months)
4. Receive license or feedback

## Conclusion

EMI licensing provides significant opportunities for fintech businesses...`,
      category: 'Licensing',
      tags: ['EMI', 'Europe', 'Licensing', 'Fintech'],
      author: 'EklFounder Team',
      publishedAt: new Date('2024-01-15'),
      isPublished: true,
      locale: 'EN' as const
    },
    {
      title: 'Best Payment Service Providers for E-commerce',
      slug: 'best-psp-ecommerce-2024',
      excerpt: 'Comprehensive comparison of payment service providers for online businesses in 2024.',
      content: `# Best Payment Service Providers for E-commerce

## Overview

Choosing the right payment service provider is crucial for e-commerce success...

## Top PSPs

### 1. Stripe
- Excellent developer experience
- Global coverage
- Competitive pricing

### 2. Adyen
- Enterprise-grade solution
- Advanced fraud protection
- Multi-channel support

## Conclusion

The best PSP depends on your specific business needs...`,
      category: 'Comparison',
      tags: ['PSP', 'E-commerce', 'Payments', 'Stripe', 'Adyen'],
      author: 'Sarah Johnson',
      publishedAt: new Date('2024-01-20'),
      isPublished: true,
      locale: 'EN' as const
    }
  ]

  for (const post of blogPosts) {
    const created = await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post
    })
    console.log(`✅ Blog post created/updated: ${created.title}`)
  }

  // Create sample newsletter subscribers
  const subscribers = [
    'user1@example.com',
    'user2@example.com',
    'user3@example.com'
  ]

  for (const email of subscribers) {
    await prisma.newsletter.upsert({
      where: { email },
      update: {},
      create: { email, isActive: true }
    })
  }

  console.log(`✅ Created ${subscribers.length} newsletter subscribers`)

  // Create sample onboarding requests
  const fintechs = await prisma.fintech.findMany({ take: 3 })
  
  if (fintechs.length > 0) {
    const onboardingRequests = [
      {
        fintechId: fintechs[0].id,
        contactEmail: 'john@acmecorp.com',
        contactName: 'John Smith',
        contactPhone: '+1234567890',
        companyName: 'Acme Corp',
        companyType: 'Limited Company',
        companyRegistration: 'AC123456',
        companyAddress: '123 Business Street, London',
        companyCountry: 'UK',
        estimatedTurnover: 500000,
        businessDescription: 'E-commerce platform selling consumer electronics',
        status: 'PENDING' as const
      },
      {
        fintechId: fintechs[1].id,
        contactEmail: 'sarah@techstartup.com',
        contactName: 'Sarah Johnson',
        contactPhone: '+1987654321',
        companyName: 'Tech Startup Ltd',
        companyType: 'Private Limited',
        companyRegistration: 'TS789012',
        companyAddress: '456 Innovation Hub, Manchester',
        companyCountry: 'UK',
        estimatedTurnover: 250000,
        businessDescription: 'SaaS platform for project management',
        status: 'REVIEW' as const
      }
    ]

    for (const request of onboardingRequests) {
      const created = await prisma.onboardingRequest.create({
        data: request
      })
      console.log(`✅ Onboarding request created: ${created.companyName}`)
    }
  }

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 