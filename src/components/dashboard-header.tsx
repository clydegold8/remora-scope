import { Activity, Waves } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Waves className="h-8 w-8 text-primary animate-pulse-glow" />
                <Activity className="absolute -top-1 -right-1 h-4 w-4 text-accent" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Sensor Detection Hub</h1>
                <p className="text-xs text-muted-foreground">Marine Analytics Platform</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
              <span>System Online</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}