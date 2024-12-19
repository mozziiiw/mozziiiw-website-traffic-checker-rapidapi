"use client"

import { useState } from "react"
import { Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

interface TrafficData {
  GlobalRank: {
    Rank: number
  }
  CountryRank: {
    Country: number
    CountryCode: string
    Rank: number
  }
  CategoryRank: {
    Rank: string
    Category: string
  }
  Engagments: {
    BounceRate: string
    PagePerVisit: string
    Visits: string
    TimeOnSite: string
    Month: string
    Year: string
  }
  EstimatedMonthlyVisits: Record<string, number>
  TrafficSources: {
    Social: number
    'Paid Referrals': number
    Mail: number
    Referrals: number
    Search: number
    Direct: number
  }
  TopCountryShares: Array<{
    Country: number
    CountryCode: string
    Value: number
  }>
  Description: string
  Title: string
  Category: string
}

function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export default function TrafficDashboard() {
  const [domain, setDomain] = useState("")
  const [data, setData] = useState<TrafficData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function analyzeDomain() {
    if (!domain) return
    
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/analyze?domain=${encodeURIComponent(domain)}`)
      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      setData(result)
    } catch (error) {
      console.error('Failed to analyze domain:', error)
      setError(error instanceof Error ? error.message : 'Failed to analyze domain')
    } finally {
      setLoading(false)
    }
  }

  const trafficData = data?.EstimatedMonthlyVisits
    ? Object.entries(data.EstimatedMonthlyVisits).map(([date, visits]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        visits,
      }))
    : []

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex gap-4">
        <Input
          placeholder="Enter domain (e.g. example.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={analyzeDomain} disabled={loading}>
          <Search className="mr-2 h-4 w-4" />
          {loading ? 'Analyzing...' : 'Analyze'}
        </Button>
      </div>

      {error && (
        <div className="text-red-500 bg-red-50 p-4 rounded-md">
          {error}
        </div>
      )}

      {data && (
        <div className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Global Rank</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">#{data.GlobalRank.Rank.toLocaleString()}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(Number(data.Engagments.BounceRate) * 100).toFixed(1)}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pages/Visit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Number(data.Engagments.PagePerVisit).toFixed(1)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Visits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(Number(data.Engagments.Visits))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Traffic Graph */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Trend</CardTitle>
              <CardDescription>Monthly visits over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => formatNumber(value)}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatNumber(value), 'Visits']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="visits" 
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Distribution of traffic by source</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(data.TrafficSources).map(([source, value]) => (
                  <div key={source} className="flex items-center justify-between">
                    <div className="text-sm font-medium">{source}</div>
                    <div className="text-sm">{(value * 100).toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}