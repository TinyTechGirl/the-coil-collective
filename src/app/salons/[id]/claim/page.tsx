import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Toaster, toast } from 'sonner'

async function submitClaim(formData: FormData) {
  'use server'
  
  const salonId = formData.get('salonId') as string
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const relationship = formData.get('relationship') as string
  const proof = formData.get('proof') as string

  // Validate required fields
  if (!name || !email || !phone || !relationship || !proof) {
    throw new Error('Please fill in all required fields')
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new Error('Please enter a valid email address')
  }

  // Validate phone number
  const phoneRegex = /^\+?[\d\s-()]{8,}$/
  if (!phoneRegex.test(phone)) {
    throw new Error('Please enter a valid phone number')
  }

  const { error } = await supabase
    .from('claim_requests')
    .insert([
      {
        salon_id: salonId,
        name,
        email,
        phone,
        relationship,
        proof,
        status: 'pending'
      }
    ])

  if (error) {
    throw new Error('Failed to submit claim request: ' + error.message)
  }

  revalidatePath(`/salons/${salonId}`)
  redirect(`/salons/${salonId}?claimed=true`)
}

export default async function ClaimSalonPage({
  params,
}: {
  params: { id: string }
}) {
  // Fetch salon details
  const { data: salon } = await supabase
    .from('salons')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!salon) {
    redirect('/')
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Claim {salon.name}</h1>
          <p className="text-gray-600 mb-6">
            Please fill out this form to claim ownership of this salon listing. We'll review your request and get back to you within 2-3 business days.
          </p>
          
          <form action={submitClaim} className="space-y-6">
            <input type="hidden" name="salonId" value={salon.id} />
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Your Name *
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                required
                className="mt-1"
                placeholder="+44..."
              />
            </div>

            <div>
              <label htmlFor="relationship" className="block text-sm font-medium text-gray-700">
                Your Relationship to the Salon *
              </label>
              <Input
                type="text"
                id="relationship"
                name="relationship"
                required
                className="mt-1"
                placeholder="e.g., Owner, Manager, etc."
              />
            </div>

            <div>
              <label htmlFor="proof" className="block text-sm font-medium text-gray-700">
                Proof of Ownership/Relationship *
              </label>
              <Textarea
                id="proof"
                name="proof"
                required
                className="mt-1"
                placeholder="Please provide details about your relationship to the salon and any proof you can offer (e.g., business registration, employment contract, etc.)"
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full">
              Submit Claim Request
            </Button>
          </form>
        </Card>
      </div>
    </>
  )
} 