import { cookies } from 'next/headers'

export default function LocationText() {
  const cookieStore = cookies()
  const city = cookieStore.get('user_city')
  if (city) {
    return <span>{city.value}</span>
  }
  return null
}
