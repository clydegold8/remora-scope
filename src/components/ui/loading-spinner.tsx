import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={cn("animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary", sizeClasses[size], className)} />
  )
}

export function LoadingOverlay({ isLoading, children, className }: {
  isLoading: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
          <LoadingSpinner size="lg" />
        </div>
      )}
    </div>
  )
}