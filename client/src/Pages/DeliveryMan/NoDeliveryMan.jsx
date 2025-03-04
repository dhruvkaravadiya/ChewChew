import { Package } from "lucide-react"

export default function NoDeliverymen() {
      return (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
                  <div className="animate-bounce mb-4">
                        <Package size={64} className="text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Deliverymen Found</h2>
                  <p className="text-gray-500">There are currently no deliverymen affiliated with your restaurant.</p>
            </div>
      )
}

