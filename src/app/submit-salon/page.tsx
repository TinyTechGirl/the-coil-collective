import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Toaster, toast } from 'sonner'

// Validation functions
function validateUrl(url: string | null): boolean {
  if (!url) return true
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function validatePhone(phone: string | null): boolean {
  if (!phone) return true
  // Basic phone validation - allows international format
  return /^\+?[\d\s-()]{8,}$/.test(phone)
}

function validateServices(services: string): boolean {
  if (!services.trim()) return false
  const serviceList = services.split(',').map(s => s.trim())
  return serviceList.length > 0 && serviceList.every(s => s.length > 0)
}

async function submitSalon(formData: FormData) {
  'use server'
  
  const name = formData.get('name') as string
  const city = formData.get('city') as string
  const address = formData.get('address') as string
  const postcode = formData.get('postcode') as string
  const services = formData.get('services') as string
  const instagram_url = formData.get('instagram_url') as string
  const website_url = formData.get('website_url') as string
  const phone = formData.get('phone') as string

  // Validate required fields
  if (!name || !city || !address || !postcode || !services) {
    throw new Error('Please fill in all required fields')
  }

  // Validate services format
  if (!validateServices(services)) {
    throw new Error('Please enter at least one valid service')
  }

  // Validate URLs
  if (!validateUrl(instagram_url)) {
    throw new Error('Please enter a valid Instagram URL')
  }
  if (!validateUrl(website_url)) {
    throw new Error('Please enter a valid website URL')
  }

  // Validate phone number
  if (!validatePhone(phone)) {
    throw new Error('Please enter a valid phone number')
  }

  const { error } = await supabase
    .from('salons')
    .insert([
      {
        name,
        city,
        address,
        postcode,
        services: services.split(',').map(s => s.trim()),
        instagram_url: instagram_url || null,
        website_url: website_url || null,
        phone: phone || null,
        status: 'pending'
      }
    ])

  if (error) {
    throw new Error('Failed to submit salon: ' + error.message)
  }

  revalidatePath('/')
  redirect('/?submitted=true')
}

export default function SubmitSalonPage() {
  return (
    <>
      <Toaster position="top-center" />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Submit a Salon</h1>
          
          <form action={submitSalon} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Salon Name *
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1"
                placeholder="Enter salon name"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City *
              </label>
              <Input
                type="text"
                id="city"
                name="city"
                required
                className="mt-1"
                placeholder="Enter city"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address *
              </label>
              <Textarea
                id="address"
                name="address"
                required
                className="mt-1"
                placeholder="Enter full address"
              />
            </div>

            <div>
              <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">
                Postcode *
              </label>
              <Input
                type="text"
                id="postcode"
                name="postcode"
                required
                className="mt-1"
                placeholder="Enter postcode"
              />
            </div>

            <div>
              <label htmlFor="services" className="block text-sm font-medium text-gray-700">
                Services (comma-separated) *
              </label>
              <Input
                type="text"
                id="services"
                name="services"
                required
                className="mt-1"
                placeholder="e.g. Curly Cut, Color, Treatment"
              />
            </div>

            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                Instagram URL
              </label>
              <Input
                type="url"
                id="instagram"
                name="instagram_url"
                className="mt-1"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website URL
              </label>
              <Input
                type="url"
                id="website"
                name="website_url"
                className="mt-1"
                placeholder="https://..."
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                className="mt-1"
                placeholder="+44..."
              />
            </div>

            <Button type="submit" className="w-full">
              Submit Salon
            </Button>
          </form>
        </Card>
      </div>
    </>
  )
} 