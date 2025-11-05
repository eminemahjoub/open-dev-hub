// Types pour les institutions fintech
export interface Fintech {
  id: string
  name: string
  slug: string
  logo?: string
  description: string
  website?: string
  
  // Informations financières
  monthlyFee: number | string
  setupFee?: number
  transactionFees?: string
  
  // Informations géographiques
  countries: string[]
  supportedCurrencies?: string[]
  
  // Classifications
  category: 'EMI' | 'Bank' | 'PSP' | 'Crypto' | 'Other'
  acceptedRisk: 'Low' | 'Medium' | 'High'
  minTurnover?: number
  
  // Statuts
  isPartner: boolean
  isVerified: boolean
  isRecommended?: boolean
  
  // Évaluations
  rating?: number
  reviewCount?: number
  
  // Documents requis
  requiredDocuments?: string[]
  
  // Métadonnées
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

// Types pour les demandes d'onboarding
export interface OnboardingRequest {
  id: string
  fintechId: string
  fintech?: Fintech
  
  // Informations du demandeur
  contactEmail: string
  contactName: string
  contactPhone?: string
  
  // Informations de l'entreprise
  companyName: string
  companyType: string
  companyRegistration?: string
  companyAddress: string
  companyCountry: string
  
  // Informations financières
  estimatedTurnover: number
  businessDescription: string
  
  // Documents
  documents?: UploadedDocument[]
  
  // Statut
  status: 'pending' | 'review' | 'approved' | 'rejected' | 'completed'
  statusNotes?: string
  
  // Métadonnées
  createdAt: Date
  updatedAt: Date
}

// Types pour les documents uploadés
export interface UploadedDocument {
  id: string
  filename: string
  originalName: string
  mimetype: string
  size: number
  url: string
  documentType: 'passport' | 'company_registration' | 'bank_statement' | 'proof_of_address' | 'other'
  uploadedAt: Date
}

// Types pour les utilisateurs admin
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'super_admin'
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

// Types pour les filtres de recherche
export interface SearchFilters {
  query?: string
  category?: string[]
  countries?: string[]
  riskLevel?: string[]
  monthlyFeeRange?: [number, number]
  isPartner?: boolean
  minRating?: number
}

// Types pour la pagination
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Types pour les articles de blog
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  publishedAt?: Date
  isPublished: boolean
  locale: 'en' | 'fr'
  createdAt: Date
  updatedAt: Date
}

// Types pour les comparaisons
export interface Comparison {
  id: string
  fintechs: Fintech[]
  createdAt: Date
}

// Types pour les statistiques
export interface DashboardStats {
  totalFintechs: number
  totalRequests: number
  pendingRequests: number
  approvedRequests: number
  monthlySignups: number
  popularFintechs: Fintech[]
} 