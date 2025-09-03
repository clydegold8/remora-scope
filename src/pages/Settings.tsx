import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Settings as SettingsIcon, Key, UserPlus, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import ChangePasswordForm from "@/components/ChangePasswordForm"
import InviteUserForm from "@/components/InviteUserForm"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function Settings() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // For now, we'll consider the first user or any user as admin
    // In a real app, you'd have a proper role system
    if (user) {
      setIsAdmin(true) // Simplified admin check
    }
  }, [user])

  const handlePasswordChanged = () => {
    toast({
      title: "Password Updated",
      description: "Your password has been successfully changed.",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="glass-card mb-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <SettingsIcon className="h-6 w-6 text-primary" />
                <CardTitle>Settings</CardTitle>
              </div>
              <CardDescription>
                Manage your account settings and system configuration
              </CardDescription>
            </CardHeader>
          </Card>

          <Tabs defaultValue="password" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="password" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Change Password
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="invite" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Invite Users
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="password" className="space-y-6">
              <div className="flex justify-center">
                <ChangePasswordForm onPasswordChanged={handlePasswordChanged} />
              </div>
            </TabsContent>

            {isAdmin && (
              <TabsContent value="invite" className="space-y-6">
                <div className="flex justify-center">
                  <InviteUserForm />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}