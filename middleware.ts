import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export interface IpData {
  ip: string
  city: string
  region_code: string
  postal: string
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const nextUrl = request.nextUrl
  const cookieAge = 14400 // 4 hours
  
  const test = nextUrl.searchParams.get('utm_campaign') as string
  response.cookies.set('utm_campaign', test, { maxAge: cookieAge })

  try {
    const res = await fetch(
      `https://ipapi.co/json/?key=${process.env.NEXT_PUBLIC_IPAPI_KEY}`,
    );

    if (!res.ok) {    
      throw new Error('IP fetch failed')
    }

    const data: IpData = await res.json()

    response.cookies.set('user_ip', data.ip, { maxAge: cookieAge })
    response.cookies.set('user_city', data.city, { maxAge: cookieAge })
    response.cookies.set('user_state', data.region_code, { maxAge: cookieAge })
    response.cookies.set('user_zipcode', data.postal, { maxAge: cookieAge })

    return response
  } catch (error) {
    return
  }
}
 
export const config = {
  matcher: '/',
}