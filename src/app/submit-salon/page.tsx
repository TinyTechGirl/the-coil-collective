import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

export default function SubmitSalonPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Submit a Salon</h1>
        
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Salon Name
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <Input
              type="text"
              id="city"
              name="city"
              required
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <Textarea
              id="address"
              name="address"
              required
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">
              Postcode
            </label>
            <Input
              type="text"
              id="postcode"
              name="postcode"
              required
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="services" className="block text-sm font-medium text-gray-700">
              Services (comma-separated)
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
              Instagram URL (optional)
            </label>
            <Input
              type="url"
              id="instagram"
              name="instagram_url"
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Website URL (optional)
            </label>
            <Input
              type="url"
              id="website"
              name="website_url"
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number (optional)
            </label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              className="mt-1"
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Salon
          </Button>
        </form>
      </Card>
    </div>
  )
} 