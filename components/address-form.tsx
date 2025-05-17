"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { AddressFormData, UserAddress } from "@/lib/types"
import { useLanguage } from "@/contexts/language-context"

interface AddressFormProps {
  initialData?: Partial<AddressFormData>
  onSubmit: (data: AddressFormData) => void
  onCancel?: () => void
  isSubmitting?: boolean
}

export function AddressForm({ initialData, onSubmit, onCancel, isSubmitting = false }: AddressFormProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [formData, setFormData] = useState<AddressFormData>({
    street_address: initialData?.street_address || "",
    apartment: initialData?.apartment || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zip_code: initialData?.zip_code || "",
    special_instructions: initialData?.special_instructions || "",
    is_default: initialData?.is_default || false,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear error when field is edited
    if (errors[name as keyof AddressFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_default: checked }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AddressFormData, string>> = {}
    
    if (!formData.street_address.trim()) {
      newErrors.street_address = "Street address is required"
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }
    
    if (!formData.state.trim()) {
      newErrors.state = "State/Province is required"
    }
    
    if (!formData.zip_code.trim()) {
      newErrors.zip_code = "Zip/Postal code is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    } else {
      toast({
        title: "Form Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="street_address">
          Street Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="street_address"
          name="street_address"
          placeholder="123 Main St"
          value={formData.street_address}
          onChange={handleChange}
          className={errors.street_address ? "border-red-500" : ""}
        />
        {errors.street_address && (
          <p className="text-sm text-red-500">{errors.street_address}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="apartment">Apartment/Suite (optional)</Label>
        <Input
          id="apartment"
          name="apartment"
          placeholder="Apt 4B"
          value={formData.apartment}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">
            City <span className="text-red-500">*</span>
          </Label>
          <Input
            id="city"
            name="city"
            placeholder="New York"
            value={formData.city}
            onChange={handleChange}
            className={errors.city ? "border-red-500" : ""}
          />
          {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">
            State/Province <span className="text-red-500">*</span>
          </Label>
          <Input
            id="state"
            name="state"
            placeholder="NY"
            value={formData.state}
            onChange={handleChange}
            className={errors.state ? "border-red-500" : ""}
          />
          {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="zip_code">
          Zip/Postal Code <span className="text-red-500">*</span>
        </Label>
        <Input
          id="zip_code"
          name="zip_code"
          placeholder="10001"
          value={formData.zip_code}
          onChange={handleChange}
          className={errors.zip_code ? "border-red-500" : ""}
        />
        {errors.zip_code && <p className="text-sm text-red-500">{errors.zip_code}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="special_instructions">Special Delivery Instructions (optional)</Label>
        <Textarea
          id="special_instructions"
          name="special_instructions"
          placeholder="Ring doorbell twice, leave at door, etc."
          value={formData.special_instructions}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="is_default" 
          checked={formData.is_default}
          onCheckedChange={handleCheckboxChange}
        />
        <Label htmlFor="is_default" className="text-sm font-normal">
          Set as default address
        </Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Address"}
        </Button>
      </div>
    </form>
  )
}
