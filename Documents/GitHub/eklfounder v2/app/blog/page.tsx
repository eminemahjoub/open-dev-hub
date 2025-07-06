import { Metadata } from 'next'
import { BlogList } from '@/components/blog/BlogList'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Latest insights and guides about fintech institutions and financial services.',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Blog & Insights
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest fintech trends, guides, and institution reviews
            </p>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <BlogList />
      </div>
    </div>
  )
} 