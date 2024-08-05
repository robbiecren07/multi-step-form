import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const data = await request.json()
  const cookieStore = cookies()
  const userIp = cookieStore.get('user_ip') ?? { value: '' }

  const leadData = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phoneNumber: data.phone,
    zipCode: data.zipcode,
    address: data.address,
    ipAddress: userIp.value,
  }

  console.log(leadData)

  return new Response('Form Submitted!', {
    status: 200,
  })
}
