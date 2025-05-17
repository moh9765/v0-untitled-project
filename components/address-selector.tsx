"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddressForm } from "@/components/address-form"
import { AddressFormData, UserAddress } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { Home, MapPin, Plus, Loader2 } from "lucide-react"

interface AddressSelectorProps {
  userId: string
  onAddressSelected: (address: UserAddress) => void
  selectedAddressId?: number
}

export function AddressSelector({ userId, onAddressSelected, selectedAddressId }: AddressSelectorProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<number | undefined>(selectedAddressId)

  // Fetch user addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!userId) return

      try {
        setLoading(true)
        const response = await fetch(`/api/addresses?userId=${userId}`)
        const data = await response.json()

        if (response.ok) {
          setAddresses(data.addresses || [])
          
          // If we have addresses but no selection, select the default one
          if (data.addresses?.length > 0 && !selectedAddressId) {
            const defaultAddress = data.addresses.find((addr: UserAddress) => addr.is_default)
            if (defaultAddress) {
              setSelectedAddress(defaultAddress.id)
              onAddressSelected(defaultAddress)
            } else {
              // If no default, select the first one
              setSelectedAddress(data.addresses[0].id)
              onAddressSelected(data.addresses[0])
            }
          }
        } else {
          console.error("Failed to fetch addresses:", data.error)
        }
      } catch (error) {
        console.error("Error fetching addresses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAddresses()
  }, [userId, selectedAddressId, onAddressSelected])

  const handleAddressChange = (addressId: string) => {
    const id = parseInt(addressId)
    setSelectedAddress(id)
    const address = addresses.find(addr => addr.id === id)
    if (address) {
      onAddressSelected(address)
    }
  }

  const handleAddAddress = async (formData: AddressFormData) => {
    if (!userId) return

    try {
      setSubmitting(true)
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, address: formData }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Address Added",
          description: "Your address has been saved successfully.",
        })
        
        // Add the new address to the list
        setAddresses(prev => [...prev, data.address])
        
        // Select the new address
        setSelectedAddress(data.address.id)
        onAddressSelected(data.address)
        
        // Close the form
        setShowAddForm(false)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add address",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding address:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {addresses.length > 0 ? (
        <>
          <RadioGroup value={selectedAddress?.toString()} onValueChange={handleAddressChange}>
            <div className="space-y-3">
              {addresses.map((address) => (
                <div key={address.id} className="flex items-start space-x-2">
                  <RadioGroupItem value={address.id.toString()} id={`address-${address.id}`} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={`address-${address.id}`} className="flex flex-col">
                      <Card className={`border ${selectedAddress === address.id ? 'border-primary' : 'border-muted'}`}>
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <Home className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="font-medium">
                                {address.street_address}
                                {address.apartment ? `, ${address.apartment}` : ""}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {address.city}, {address.state} {address.zip_code}
                              </p>
                              {address.special_instructions && (
                                <p className="text-xs text-muted-foreground mt-1 italic">
                                  {address.special_instructions}
                                </p>
                              )}
                              {address.is_default && (
                                <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>

          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2 mt-4"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4" />
            Add New Address
          </Button>
        </>
      ) : (
        <div className="text-center py-4">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No Saved Addresses</h3>
          <p className="text-muted-foreground mb-4">
            Please add a delivery address to continue
          </p>
          <Button onClick={() => setShowAddForm(true)}>Add Address</Button>
        </div>
      )}

      {/* Add Address Form Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <AddressForm 
            onSubmit={handleAddAddress} 
            onCancel={() => setShowAddForm(false)}
            isSubmitting={submitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
