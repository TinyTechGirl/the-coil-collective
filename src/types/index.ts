export interface Salon {
  id: string
  name: string
  city: string
  address: string
  postcode: string
  services: string[]
  instagram_url?: string
  website_url?: string
  phone?: string
  claimed: boolean
  claimed_by?: string
  created_at: string
}

export interface WaitlistEmail {
  id: string
  email: string
  created_at: string
}

export interface SubmittedSalon {
  id: string
  name: string
  city: string
  address: string
  postcode: string
  services: string[]
  instagram_url?: string
  website_url?: string
  phone?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface ClaimRequest {
  id: string
  salon_id: string
  user_id: string
  proof: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
} 