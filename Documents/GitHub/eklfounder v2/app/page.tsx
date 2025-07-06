import { Hero } from '@/components/home/Hero'
import { FeaturedFintechs } from '@/components/home/FeaturedFintechs'
import { HowItWorks } from '@/components/home/HowItWorks'
import { Newsletter } from '@/components/home/Newsletter'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedFintechs />
      <HowItWorks />
      <Newsletter />
    </div>
  )
} 