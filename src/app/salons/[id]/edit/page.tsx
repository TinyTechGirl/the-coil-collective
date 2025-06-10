import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Toaster, toast } from 'sonner'

interface Props {
  params: {
    id: string
  }
}

async function updateSalon(formData: FormData) {
  'use server'

  const salonId = formData.get('id') as string
  const name = formData.get('name') as string
  const city = formData.get('city') as string
  const address = formData.get('address') as string
  const postcode = formData.get('postcode') as string
  const services = (formData.get('services') as string).split(',').map(s => s.trim())
  const instagram_url = formData.get('instagram_url') as string
  const website_url = formData.get('website_url') as string
  const phone = formData.get('phone') as string

  // TODO: Replace with actual user authentication
  const ownerEmail = 'test@example.com'

  // Validate required fields
  if (!name || !city || !address || !postcode || services.length === 0) {
    throw new Error('Please fill in all required fields')
  }

  // Validate URLs if provided
  if (instagram_url && !instagram_url.startsWith('https://instagram.com/')) {
    throw new Error('Please enter a valid Instagram URL')
  }
  if (website_url && !website_url.startsWith('http')) {
    throw new Error('Please enter a valid website URL')
  }

  // Validate phone number if provided
  if (phone && !/^\+?[\d\s-]{10,}$/.test(phone)) {
    throw new Error('Please enter a valid phone number')
  }

  const { error } = await supabase
    .from('salons')
    .update({
      name,
      city,
      address,
      postcode,
      services,
      instagram_url: instagram_url || null,
      website_url: website_url || null,
      phone: phone || null,
    })
    .eq('id', salonId)
    .eq('owner_email', ownerEmail)

  if (error) {
    throw new Error('Failed to update salon')
  }

  revalidatePath(`/salons/${salonId}`)
  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export default async function EditSalonPage({ params }: Props) {
  const salonId = params.id

  // TODO: Replace with actual user authentication
  const ownerEmail = 'test@example.com'

  const { data: salon, error } = await supabase
    .from('salons')
    .select('*')
    .eq('id', salonId)
    .eq('owner_email', ownerEmail)
    .single()

  if (error || !salon) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2">Salon not found or you don't have permission to edit it.</p>
          <Button asChild className="mt-4">
            <a href="/dashboard">Return to Dashboard</a>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Edit Salon</h1>

          <form action={updateSalon} className="space-y-6">
            <input type="hidden" name="id" value={salon.id} />

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Salon Name *
              </label>
              <Input
                id="name"
                name="name"
                defaultValue={salon.name}
                required
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City *
              </label>
              <Input
                id="city"
                name="city"
                defaultValue={salon.city}
                required
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address *
              </label>
              <Input
                id="address"
                name="address"
                defaultValue={salon.address}
                required
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">
                Postcode *
              </label>
              <Input
                id="postcode"
                name="postcode"
                defaultValue={salon.postcode}
                required
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="services" className="block text-sm font-medium text-gray-700">
                Services (comma-separated) *
              </label>
              <Textarea
                id="services"
                name="services"
                defaultValue={salon.services.join(', ')}
                required
                className="mt-1"
                placeholder="e.g. Curly Cut, Color, Treatment"
              />
            </div>

            <div>
              <label htmlFor="instagram_url" className="block text-sm font-medium text-gray-700">
                Instagram URL
              </label>
              <Input
                id="instagram_url"
                name="instagram_url"
                type="url"
                defaultValue={salon.instagram_url || ''}
                className="mt-1"
                placeholder="https://instagram.com/your-handle"
              />
            </div>

            <div>
              <label htmlFor="website_url" className="block text-sm font-medium text-gray-700">
                Website URL
              </label>
              <Input
                id="website_url"
                name="website_url"
                type="url"
                defaultValue={salon.website_url || ''}
                className="mt-1"
                placeholder="https://your-website.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={salon.phone || ''}
                className="mt-1"
                placeholder="+44 123 456 7890"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" asChild>
                <a href="/dashboard">Cancel</a>
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  )
} 