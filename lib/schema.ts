import { z } from 'zod'

const schema = z.object({
  zipcode: z.string().regex(/^\d{5}$/, 'Invalid zip code.'),
  address: z.string().min(5, 'Enter a valid address.'),
  firstName: z.string().min(2, 'First name must be at least 2 characters long.'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters long.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().regex(/^\d{10}$/, 'Invalid phone number.'),
})

export default schema
