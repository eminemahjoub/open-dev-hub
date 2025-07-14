'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Building, 
  FileText, 
  TrendingUp, 
  Plus,
  Settings,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { statsApi, onboardingApi, institutionsApi, newsletterApi, handleApiError } from '@/lib/api'

interface DashboardStats {
  totalInstitutions: number
  pendingApplications: number
  activeUsers: number
  monthlyGrowth: string
  totalApplications: number
  approvedApplications: number
  rejectedApplications: number
  newsletterSubscribers: number
}

interface Application {
  id: string
  companyName: string
  contactEmail: string
  status: string
  fintechId: string
  fintech?: {
    name: string
    category: string
  }
  createdAt: string
}

interface Institution {
  id: string
  name: string
  category: string
  isActive: boolean
  isPartner: boolean
  isVerified: boolean
  rating?: number
  applicationCount?: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [
        statsResponse,
        applicationsResponse,
        institutionsResponse
      ] = await Promise.all([
        statsApi.getDashboard(),
        onboardingApi.getAll({ limit: 10, sortBy: 'createdAt', sortOrder: 'desc' }),
        institutionsApi.getAll({ limit: 10, sortBy: 'createdAt', sortOrder: 'desc' })
      ])

      setStats(statsResponse)
      setApplications(applicationsResponse.data)
      setInstitutions(institutionsResponse.data)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleApplicationAction = async (applicationId: string, status: string, notes?: string) => {
    try {
      setActionLoading(applicationId)
      await onboardingApi.updateStatus(applicationId, { status, statusNotes: notes })
      
      // Update local state
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status } : app
      ))
      
      // Refresh stats
      const updatedStats = await statsApi.getDashboard()
      setStats(updatedStats)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setActionLoading(null)
    }
  }

  const handleInstitutionToggle = async (institutionId: string, field: 'isActive' | 'isPartner' | 'isVerified') => {
    try {
      setActionLoading(institutionId)
      const institution = institutions.find(i => i.id === institutionId)
      if (!institution) return

      await institutionsApi.update(institutionId, { 
        [field]: !institution[field] 
      })
      
      // Update local state
      setInstitutions(prev => prev.map(inst => 
        inst.id === institutionId ? { ...inst, [field]: !inst[field] } : inst
      ))
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setActionLoading(null)
    }
  }

  const exportData = async (type: 'applications' | 'institutions' | 'stats') => {
    try {
      setActionLoading(`export-${type}`)
      
      let data
      switch (type) {
        case 'applications':
          const allApps = await onboardingApi.getAll({ limit: 1000 })
          data = allApps.data
          break
        case 'institutions':
          const allInsts = await institutionsApi.getAll({ limit: 1000 })
          data = allInsts.data
          break
        case 'stats':
          data = stats
          break
      }

      // Convert to CSV and download
      const csv = convertToCSV(data)
      downloadCSV(csv, `${type}-${new Date().toISOString().split('T')[0]}.csv`)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setActionLoading(null)
    }
  }

  const convertToCSV = (data: any) => {
    if (!data || !Array.isArray(data) && typeof data !== 'object') return ''
    
    if (!Array.isArray(data)) {
      data = [data]
    }

    const headers = Object.keys(data[0] || {})
    const csvContent = [
      headers.join(','),
      ...data.map((row: any) => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n')

    return csvContent
  }

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success'
      case 'rejected':
        return 'destructive'
      case 'pending':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchDashboardData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const dashboardStats = [
    { 
      label: 'Total Institutions', 
      value: stats?.totalInstitutions?.toString() || '0', 
      icon: Building, 
      color: 'text-blue-600' 
    },
    { 
      label: 'Pending Applications', 
      value: stats?.pendingApplications?.toString() || '0', 
      icon: FileText, 
      color: 'text-yellow-600' 
    },
    { 
      label: 'Newsletter Subscribers', 
      value: stats?.newsletterSubscribers?.toString() || '0', 
      icon: Users, 
      color: 'text-green-600' 
    },
    { 
      label: 'Monthly Growth', 
      value: stats?.monthlyGrowth || '+0%', 
      icon: TrendingUp, 
      color: 'text-purple-600' 
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage institutions, applications, and users</p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <div key={stat.label} className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-muted/30 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Applications</p>
              <p className="text-xl font-bold text-foreground">{stats?.totalApplications || 0}</p>
            </div>
            <Mail className="h-6 w-6 text-blue-500" />
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Approval Rate</p>
              <p className="text-xl font-bold text-foreground">
                {stats?.totalApplications ? 
                  Math.round((stats.approvedApplications / stats.totalApplications) * 100) : 0}%
              </p>
            </div>
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Rejected Rate</p>
              <p className="text-xl font-bold text-foreground">
                {stats?.totalApplications ? 
                  Math.round((stats.rejectedApplications / stats.totalApplications) * 100) : 0}%
              </p>
            </div>
            <XCircle className="h-6 w-6 text-red-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Institution
        </Button>
        <Button 
          variant="outline"
          onClick={() => exportData('applications')}
          disabled={actionLoading === 'export-applications'}
        >
          {actionLoading === 'export-applications' ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Export Applications
        </Button>
        <Button 
          variant="outline"
          onClick={() => exportData('institutions')}
          disabled={actionLoading === 'export-institutions'}
        >
          {actionLoading === 'export-institutions' ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Export Institutions
        </Button>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Applications</h3>
            <Badge variant="secondary">{applications.length}</Badge>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {applications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-foreground truncate">{app.companyName}</p>
                    {getStatusIcon(app.status)}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {app.fintech?.name || 'Unknown'} • {app.contactEmail}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Badge variant={getStatusBadgeVariant(app.status)}>
                    {app.status}
                  </Badge>
                  <div className="flex space-x-1">
                    {app.status === 'PENDING' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleApplicationAction(app.id, 'APPROVED')}
                          disabled={actionLoading === app.id}
                          title="Approve"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleApplicationAction(app.id, 'REJECTED')}
                          disabled={actionLoading === app.id}
                          title="Reject"
                        >
                          <XCircle className="h-4 w-4 text-red-600" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm" title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Institutions Management */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Institutions</h3>
            <Badge variant="secondary">{institutions.length}</Badge>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {institutions.map((institution) => (
              <div key={institution.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-foreground truncate">{institution.name}</p>
                    <div className="flex space-x-1">
                      {institution.isPartner && <Badge variant="default" className="text-xs">Partner</Badge>}
                      {institution.isVerified && <Badge variant="success" className="text-xs">Verified</Badge>}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {institution.category} • Rating: {institution.rating?.toFixed(1) || 'N/A'}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleInstitutionToggle(institution.id, 'isActive')}
                      disabled={actionLoading === institution.id}
                      title={institution.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <div className={`w-2 h-2 rounded-full ${institution.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleInstitutionToggle(institution.id, 'isPartner')}
                      disabled={actionLoading === institution.id}
                      title="Toggle Partner Status"
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Edit">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 