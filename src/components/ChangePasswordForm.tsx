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
import { Loader2, Lock, Key } from "lucide-react"

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

interface ChangePasswordFormProps {
  isFirstTimeLogin?: boolean
  onPasswordChanged?: () => void
}

export default function ChangePasswordForm({ isFirstTimeLogin = false, onPasswordChanged }: ChangePasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    try {
      setIsLoading(true)

      if (isFirstTimeLogin) {
        // For first-time login, we update the password directly
        const { error } = await supabase.auth.updateUser({
          password: data.newPassword
        })

        if (error) {
          toast({
            title: "Password Change Failed",
            description: error.message,
            variant: "destructive",
          })
          return
        }

        // Update invitation status
        const user = await supabase.auth.getUser()
        if (user.data.user) {
          await supabase
            .from('user_invitations')
            .update({ 
              is_first_login: false,
              accepted_at: new Date().toISOString()
            })
            .eq('email', user.data.user.email)
        }
      } else {
        // For regular password change, verify current password first
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: (await supabase.auth.getUser()).data.user?.email || '',
          password: data.currentPassword,
        })

        if (signInError) {
          toast({
            title: "Password Change Failed",
            description: "Current password is incorrect",
            variant: "destructive",
          })
          return
        }

        const { error } = await supabase.auth.updateUser({
          password: data.newPassword
        })

        if (error) {
          toast({
            title: "Password Change Failed",
            description: error.message,
            variant: "destructive",
          })
          return
        }
      }

      toast({
        title: "Password Changed!",
        description: "Your password has been updated successfully.",
      })

      form.reset()
      onPasswordChanged?.()
    } catch (error: any) {
      toast({
        title: "Password Change Failed",
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
          <Lock className="h-6 w-6 text-primary" />
          <Key className="h-6 w-6 text-accent" />
        </div>
        <CardTitle>
          {isFirstTimeLogin ? "Set Your Password" : "Change Password"}
        </CardTitle>
        <CardDescription>
          {isFirstTimeLogin 
            ? "Please set a new password for your account"
            : "Update your account password"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleChangePassword)} className="space-y-4">
            {!isFirstTimeLogin && (
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter current password"
                        {...field}
                        className="transition-all duration-200 focus:shadow-glow"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      {...field}
                      className="transition-all duration-200 focus:shadow-glow"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
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
                  {isFirstTimeLogin ? "Setting Password..." : "Changing Password..."}
                </>
              ) : (
                isFirstTimeLogin ? "Set Password" : "Change Password"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}