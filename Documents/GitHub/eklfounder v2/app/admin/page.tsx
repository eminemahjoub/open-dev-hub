import { Metadata } from 'next'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'EklFounder administration dashboard',
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage institutions, applications, and platform settings
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Welcome back, Admin
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminDashboard />
      </div>
    </div>
  )
} 