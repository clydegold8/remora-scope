import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
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

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type LoginFormData = z.infer<typeof loginSchema>
type RegisterFormData = z.infer<typeof registerSchema>

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
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

  const handleRegister = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      const redirectUrl = `${window.location.origin}/`
      
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl
        }
      })

      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      setEmailSent(true)
      toast({
        title: "Registration Successful!",
        description: "Please check your email to verify your account.",
      })
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-card">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Car className="h-6 w-6 text-primary" />
              <Users className="h-6 w-6 text-accent" />
            </div>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>
              We've sent you a verification link to complete your registration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please click the verification link in your email to activate your account.
                Once verified, you can log in to the Urban Traffic Hub.
              </AlertDescription>
            </Alert>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => {
                setEmailSent(false)
                setIsLogin(true)
              }}
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  console.log(registerForm.getValues(), loginForm.getValues(),)
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card animate-slide-in">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Car className="h-6 w-6 text-primary" />
            <Users className="h-6 w-6 text-accent" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isLogin ? "Welcome Back" : "Join Urban Traffic Hub"}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? "Sign in to access your traffic monitoring dashboard"
              : "Create an account to start monitoring urban traffic data"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLogin ? (
            <Form {...loginForm}>
              <form key="loginForm" onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
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
          ) : (
            <Form {...registerForm}>
              <form key="registerForm" onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emails</FormLabel>
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
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Create a password"
                          {...field}
                          className="transition-all duration-200 focus:shadow-glow"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm your password"
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
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>
          )}

          <div className="text-center mt-4 space-y-2">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}