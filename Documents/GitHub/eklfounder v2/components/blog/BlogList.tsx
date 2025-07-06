'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, User, ArrowRight, Clock, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { blogApi, handleApiError } from '@/lib/api'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  isFeatured: boolean
  isPublished: boolean
  slug: string
  locale: string
  createdAt: string
  updatedAt: string
  readTime?: string
  tags?: string[]
}

const categories = ['All', 'Guides', 'Reviews', 'Compliance', 'News']

export function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const fetchPosts = async (category?: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await blogApi.getAll({
        category: category === 'All' ? undefined : category,
        isPublished: true,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        limit: 50
      })

      setPosts(response.data)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(selectedCategory)
  }, [selectedCategory])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(' ').length
    const readTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readTime} min read`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading articles...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => fetchPosts(selectedCategory)}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No articles found.</p>
        <Button 
          variant="outline" 
          onClick={() => fetchPosts()}
        >
          Refresh
        </Button>
      </div>
    )
  }

  const featuredPosts = posts.filter(post => post.isFeatured)
  const regularPosts = posts.filter(post => !post.isFeatured)

  return (
    <div className="space-y-12">
      {/* Categories */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === selectedCategory ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Featured Articles</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="default">{post.category}</Badge>
                    <Badge variant="outline">Featured</Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3 hover:text-primary">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-muted-foreground mb-4">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime || calculateReadTime(post.content)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {post.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      )) || (
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                      )}
                    </div>
                    
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${post.slug}`}>
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Regular Posts */}
      {regularPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {featuredPosts.length > 0 ? 'Latest Articles' : 'All Articles'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <article
                key={post.id}
                className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-3 hover:text-primary">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime || calculateReadTime(post.content)}</span>
                    </div>
                    
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${post.slug}`}>
                        Read More
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Load More Button */}
      {posts.length >= 50 && (
        <div className="text-center">
          <Button 
            variant="outline"
            onClick={() => fetchPosts(selectedCategory)}
          >
            Load More Articles
          </Button>
        </div>
      )}
    </div>
  )
} 