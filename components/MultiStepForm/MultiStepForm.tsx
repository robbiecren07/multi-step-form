'use client'

import { useState, ChangeEvent, FormEvent, FocusEvent } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import schema from '@/lib/schema'
import style from './MultiStepForm.module.css'

interface Props {
  zipCode: string
  city: string
  state: string
}

// Define the form data type
type FormData = z.infer<typeof schema>

// Define the fields for each step
const stepFields: { [key: number]: (keyof FormData)[] } = {
  1: ['zipcode'],
  2: ['address'],
  3: ['firstName', 'lastName'],
  4: ['email', 'phone'],
}

export function MultiStepForm({ zipCode, city, state }: Props) {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [formData, setFormData] = useState<FormData>({
    zipcode: zipCode,
    address: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({})
  const router = useRouter()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))
  }

  const validateStep = (step: number) => {
    const fieldsToValidate = stepFields[step]
    const dataToValidate = fieldsToValidate.reduce((acc, field) => {
      acc[field] = formData[field]
      return acc
    }, {} as Partial<FormData>)

    const stepSchema = schema.pick(
      fieldsToValidate.reduce((acc, field) => {
        acc[field] = true
        return acc
      }, {} as Partial<Record<keyof FormData, true>>)
    )

    try {
      stepSchema.parse(dataToValidate)
      return true
    } catch (err) {
      if (err instanceof z.ZodError) {
        const stepErrors = err.errors.reduce((acc, error) => {
          acc[error.path[0] as keyof FormData] = error.message
          return acc
        }, {} as Partial<FormData>)
        setErrors(stepErrors)
      }
      return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (validateStep(currentStep)) {
      const response = await fetch('/api/process-lead', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        router.push('/thank-you')
      }
    }
  }

  return (
    <div className="w-full max-w-md mx-auto py-12">
      <div className="w-full flex justify-center mb-12">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`h-8 w-8 flex items-center justify-center font-semibold rounded-full ${
                currentStep >= step
                  ? 'bg-blue-600 text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step}
            </div>
            {step < 4 && (
              <div className={`h-1 w-12 ${currentStep > step ? 'bg-blue-600' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      <form className="w-full" onSubmit={handleSubmit}>
        <div className="relative w-full flex flex-col gap-4">
          <section id="step-1" className={cn(style.form_step, currentStep === 1 && style.active)}>
            <div className={style.form_step_inner}>
              <h2 className="text-xl font-semibold text-center">Enter Your Zip Code</h2>
              <div className="space-y-1">
                <Label htmlFor="zipcode">Zip Code</Label>
                <div>
                  <Input
                    id="zipcode"
                    name="zipcode"
                    pattern="[0-9]{5}"
                    maxLength={5}
                    value={formData.zipcode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="postal-code"
                  />
                </div>
                {touched.zipcode && errors.zipcode && (
                  <p className="text-red-500 text-xs">{errors.zipcode}</p>
                )}
              </div>
              <div className="flex justify-end gap-4 mt-2">
                <Button type="button" size="lg" className="w-full" onClick={handleNext}>
                  Next
                </Button>
              </div>
            </div>
          </section>

          <section id="step-2" className={cn(style.form_step, currentStep === 2 && style.active)}>
            <div className={style.form_step_inner}>
              <h2 className="text-xl font-semibold text-center">Whats Your Address?</h2>
              <div className="space-y-1">
                <Label htmlFor="address">Street Address</Label>
                <div>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="street-address"
                  />
                </div>
                {city && state && (
                  <span className="flex justify-end text-xs">
                    {city}, {state}
                  </span>
                )}
                {touched.address && errors.address && (
                  <p className="text-red-500 text-xs">{errors.address}</p>
                )}
              </div>
              <div className="flex justify-between gap-4 mt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={handlePrevious}
                >
                  Previous
                </Button>
                <Button type="button" size="lg" className="w-full" onClick={handleNext}>
                  Next
                </Button>
              </div>
            </div>
          </section>

          <section id="step-3" className={cn(style.form_step, currentStep === 3 && style.active)}>
            <div className={style.form_step_inner}>
              <h2 className="text-xl font-semibold text-center">Whats Your Name?</h2>
              <div className="grid gap-4">
                <div className="space-y-1">
                  <Label htmlFor="firstName">First Name</Label>
                  <div>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="given-name"
                    />
                  </div>
                  {touched.firstName && errors.firstName && (
                    <p className="text-red-500 text-xs">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="family-name"
                    />
                  </div>
                  {touched.lastName && errors.lastName && (
                    <p className="text-red-500 text-xs">{errors.lastName}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-between gap-4 mt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={handlePrevious}
                >
                  Previous
                </Button>
                <Button type="button" size="lg" className="w-full" onClick={handleNext}>
                  Next
                </Button>
              </div>
            </div>
          </section>

          <section id="step-4" className={cn(style.form_step, currentStep === 4 && style.active)}>
            <div className={style.form_step_inner}>
              <h2 className="text-xl font-semibold text-center">Where To Send Your Estimate?</h2>
              <div className="grid gap-4">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <div>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="email"
                    />
                  </div>
                  {touched.email && errors.email && <p className="text-red-500">{errors.email}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Phone Number</Label>
                  <div>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="tel"
                    />
                  </div>
                  {touched.email && errors.email && <p className="text-red-500">{errors.email}</p>}
                </div>
              </div>
              <div className="flex justify-between gap-4 mt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={handlePrevious}
                >
                  Previous
                </Button>
                <Button type="submit" size="lg" className="w-full">
                  Submit
                </Button>
              </div>
            </div>
          </section>
        </div>
      </form>
    </div>
  )
}
