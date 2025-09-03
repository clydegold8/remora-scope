import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Car, Users, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ChangePasswordForm from "@/components/ChangePasswordForm"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false)
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Check if user is already authenticated
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        navigate("/")
      }
    }
    checkUser()
  }, [navigate])

  const handleLogin = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      // Check if it's first time login
      const { data: inviteData } = await supabase
        .from('user_invitations')
        .select('is_first_login')
        .eq('email', data.email)
        .single()

      if (inviteData?.is_first_login) {
        setIsFirstTimeLogin(true)
        toast({
          title: "Welcome!",
          description: "Please set a new password for your account.",
        })
        return
      }

      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      })
      navigate("/")
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChanged = () => {
    setIsFirstTimeLogin(false)
    navigate("/")
  }

  if (isFirstTimeLogin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <ChangePasswordForm 
          isFirstTimeLogin={true} 
          onPasswordChanged={handlePasswordChanged}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card animate-slide-in">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Car className="h-6 w-6 text-primary" />
            <Users className="h-6 w-6 text-accent" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Welcome to Urban Traffic Hub
          </CardTitle>
          <CardDescription>
            Sign in to access your traffic monitoring dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        className="transition-all duration-200 focus:shadow-glow"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
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
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Access is by invitation only. Contact your administrator to receive login credentials.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}