import { Loader2 } from "lucide-react"

interface LoadingStateProps {
  message?: string
}

export function BookingLoadingState({ message = "Loading bookings..." }: LoadingStateProps) {
  return (
    <div className="text-center py-8">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
      <p>{message}</p>
    </div>
  )
}