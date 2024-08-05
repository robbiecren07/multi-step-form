'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { submitForm } from './actions'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const initialState = {
  message: '',
}

export function ZipEntryForm() {
  const [state, formAction] = useFormState(submitForm, initialState)
  const { pending } = useFormStatus()

  return (
    <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-lg">
      <form action={formAction}>
        <div className="flex flex-col gap-2">
          <div className="grid gap-2">
            <Label htmlFor="zipcode">Zip Code</Label>
            <div>
              <Input
                id="zipcode"
                name="zipcode"
                pattern="[0-9]{5}"
                maxLength={5}
                autoComplete="postal-code"
              />
            </div>
            <p className="text-red-600 text-xs" role="status">
              {state.message && state.message}
            </p>
          </div>
          <div className="flex justify-center items-center">
            <Button type="submit" size="lg" className="w-1/2" disabled={pending}>
              {pending ? 'Processing...' : 'Get Quote'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
