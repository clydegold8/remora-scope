import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, Shield } from "lucide-react"

const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
})

type InviteFormData = z.infer<typeof inviteSchema>

export default function InviteUserForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
    },
  })

  const generateTempPassword = () => {
    const length = 12
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return password
  }

  const handleInvite = async (data: InviteFormData) => {
    try {
      setIsLoading(true)
      const tempPassword = generateTempPassword()

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: tempPassword,
        email_confirm: true,
      })

      if (authError) {
        toast({
          title: "Invitation Failed",
          description: authError.message,
          variant: "destructive",
        })
        return
      }

      // Store invitation details
      const { error: inviteError } = await supabase
        .from('user_invitations')
        .insert({
          email: data.email,
          temp_password: tempPassword,
          invited_by: (await supabase.auth.getUser()).data.user?.id,
        })

      if (inviteError) {
        toast({
          title: "Invitation Failed",
          description: inviteError.message,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Invitation Sent!",
        description: `User invited successfully. Temporary password: ${tempPassword}`,
      })

      form.reset()
    } catch (error: any) {
      toast({
        title: "Invitation Failed",  
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md glass-card">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Shield className="h-6 w-6 text-primary" />
          <Mail className="h-6 w-6 text-accent" />
        </div>
        <CardTitle>Invite New User</CardTitle>
        <CardDescription>
          Send an invitation to join the Urban Traffic Hub
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleInvite)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter user's email"
                      {...field}
                      className="transition-all duration-200 focus:shadow-glow"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full btn-hero hover-scale"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Invitation...
                </>
              ) : (
                "Send Invitation"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}