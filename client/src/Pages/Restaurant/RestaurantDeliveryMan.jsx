import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"
import NoDeliverymen from "../DeliveryMan/NoDeliveryMan"
import AppLayout from "@/Layout/AppLayout"
import { Avatar } from "../../Components/ui/avatar"
const dummyData = [
      { id: "1", name: "John Doe", totalDeliveries: 150, earnings: 3000, phoneNumber: "1234567890", currentOrders: 2 },
      { id: "2", name: "Jane Smith", totalDeliveries: 120, earnings: 2400, phoneNumber: "9876543210", currentOrders: 1 },
      { id: "3", name: "Mike Johnson", totalDeliveries: 200, earnings: 4000, phoneNumber: "5555555555", currentOrders: 3 },
      { id: "4", name: "Emily Brown", totalDeliveries: 80, earnings: 1600, phoneNumber: "1112223333", currentOrders: 0 },
      { id: "5", name: "David Lee", totalDeliveries: 175, earnings: 3500, phoneNumber: "4444444444", currentOrders: 2 },
]

export default function DeliverymenPage() {
      const [searchTerm, setSearchTerm] = useState("")
      const filteredDeliverymen = dummyData.filter((dm) => dm.name.toLowerCase().includes(searchTerm.toLowerCase()))

      return (
            <AppLayout>
                  <div className="container mx-auto py-8">
                        <h1 className="text-3xl font-bold mb-6">Deliverymen</h1>
                        <div className="mb-6 relative">
                              <Input
                                    type="text"
                                    placeholder="Search deliverymen..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                              />
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                        {filteredDeliverymen.length > 0 ? (
                              <Table>
                                    <TableHeader>
                                          <TableRow>
                                                <TableHead>Picture</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Total Deliveries</TableHead>
                                                <TableHead>Earnings</TableHead>
                                                <TableHead>Phone Number</TableHead>
                                                <TableHead>Current Orders</TableHead>
                                          </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                          {filteredDeliverymen.map((dm) => (
                                                <TableRow key={dm.id}>
                                                      <TableCell>
                                                            <Avatar
                                                                  src={dm.picture || "/placeholder.svg"}
                                                                  alt={`${dm.name}'s picture`}
                                                                  width={40}
                                                                  height={40}
                                                                  className="rounded-full"
                                                            />
                                                      </TableCell>
                                                      <TableCell className="font-medium">{dm.name}</TableCell>
                                                      <TableCell>{dm.totalDeliveries}</TableCell>
                                                      <TableCell>${dm.earnings.toFixed(2)}</TableCell>
                                                      <TableCell>{dm.phoneNumber}</TableCell>
                                                      <TableCell>{dm.currentOrders}</TableCell>
                                                </TableRow>
                                          ))}
                                    </TableBody>
                              </Table>
                        ) : (
                              <NoDeliverymen />
                        )}
                  </div>
            </AppLayout>
      )
}

