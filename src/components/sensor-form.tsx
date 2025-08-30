import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, MapPin } from "lucide-react"

const sensorSchema = z.object({
  remoraId: z.coerce.number().min(1, "Remora ID is required"),
  peopleCount: z.coerce.number().min(0, "People count must be 0 or greater"),
  carCount: z.coerce.number().min(0, "Car count must be 0 or greater"),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  altitude: z.coerce.number().optional(),
})

type SensorFormData = z.infer<typeof sensorSchema>

interface SensorFormProps {
  onSubmit: (data: SensorFormData) => Promise<void>
  isLoading?: boolean
}

export function SensorForm({ onSubmit, isLoading = false }: SensorFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SensorFormData>({
    resolver: zodResolver(sensorSchema),
    defaultValues: {
      remoraId: 0,
      peopleCount: 0,
      carCount: 0,
      latitude: undefined,
      longitude: undefined,
      altitude: undefined,
    },
  })

  const handleSubmit = async (data: SensorFormData) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
      form.reset()
      toast({
        title: "Detection Added",
        description: "Sensor data has been successfully recorded.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add sensor detection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="glass-card animate-slide-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5 text-primary" />
          <span>Add New Detection</span>
        </CardTitle>
        <CardDescription>
          Record new sensor detection data from your marine monitoring devices.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="remoraId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remora ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 1"
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
                name="peopleCount" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>People Count</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="e.g., 3"
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
                name="carCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Car Count</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="e.g., 1"
                        {...field}
                        className="transition-all duration-200 focus:shadow-glow"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Location Data (Optional)</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="e.g., 9.3077"
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
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="e.g., 123.3054"
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
                  name="altitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Altitude (m)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="e.g., 50.5"
                          {...field}
                          className="transition-all duration-200 focus:shadow-glow"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="btn-hero hover-scale"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Detection
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}