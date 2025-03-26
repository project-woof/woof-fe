"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

interface EmptyStateProps {
  onFindPetsitter: () => void
}

export function BookingEmptyState({ onFindPetsitter }: EmptyStateProps) {
  return (
    <div className="text-center py-8">
      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
      <h3 className="font-medium text-lg mb-1">No bookings yet</h3>
      <p className="text-muted-foreground mb-4">Book a petsitter to see your bookings here</p>

      <Button onClick={onFindPetsitter}>Find a Petsitter</Button>
    </div>
  )
}