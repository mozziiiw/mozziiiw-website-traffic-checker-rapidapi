// app/api/analyze/route.ts
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const domain = searchParams.get('domain')

  if (!domain) {
    return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
  }

  const options = {
    method: 'GET',
    url: 'https://similar-web.p.rapidapi.com/get-analysis',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
      'x-rapidapi-host': 'similar-web.p.rapidapi.com'
    }
  }

  try {
    const response = await fetch(`${options.url}?domain=${encodeURIComponent(domain)}`, {
      method: options.method,
      headers: options.headers,
    })
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}