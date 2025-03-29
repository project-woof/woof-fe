import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ReviewErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-8">
      <p className="text-red-500">{error}</p>
      <Button onClick={onRetry} variant="outline" className="mt-2">
        Try Again
      </Button>
    </div>
  );
}
