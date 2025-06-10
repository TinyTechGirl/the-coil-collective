import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SubmittedSalon, ClaimRequest } from '@/types'

export default async function AdminDashboard() {
  const { data: submittedSalons } = await supabase
    .from('submitted_salons')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: claimRequests } = await supabase
    .from('claim_requests')
    .select('*, salons(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Submitted Salons Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Submitted Salons</h2>
        <div className="grid gap-4">
          {submittedSalons?.map((salon: SubmittedSalon) => (
            <Card key={salon.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{salon.name}</h3>
                  <p className="text-gray-600">{salon.city}</p>
                  <p className="text-sm text-gray-500">{salon.address}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Approve
                  </Button>
                  <Button variant="destructive" size="sm">
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Claim Requests Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Claim Requests</h2>
        <div className="grid gap-4">
          {claimRequests?.map((request: ClaimRequest & { salons: { name: string } }) => (
            <Card key={request.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{request.salons.name}</h3>
                  <p className="text-sm text-gray-500">Proof: {request.proof}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Approve
                  </Button>
                  <Button variant="destructive" size="sm">
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
} 