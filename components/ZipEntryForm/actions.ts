'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export async function submitForm(
  prevState: {
    message: string
  },
  formData: FormData
) {
  const schema = z.object({
    zipcode: z.string().regex(/^\d{5}$/),
  })

  const parse = schema.safeParse({
    zipcode: formData.get('zipcode'),
  })

  if (!parse.success) {
    return { message: 'Invalid Zip Code.' }
  }
  const data = parse.data

  const cookieStore = cookies()
  const city = cookieStore.get('user_city')
  const state = cookieStore.get('user_state')

  if (!city || !state) {
    return redirect(`/form/?zipcode=${data.zipcode}`)
  }

  return redirect(`/form/?zipcode=${data.zipcode}&city=${city.value}&state=${state.value}`)
}
