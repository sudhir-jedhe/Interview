'use client'

import { useState, useEffect } from 'react'
import { fetchWithTimeout } from '../utils/fetchWithTimeout'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'

interface ApiData {
  id: number
  title: string
}

export default function AsyncAwaitDemo() {
  const [data, setData] = useState<ApiData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchData() {
    setLoading(true)
    setError(null)
    setData([])

    try {
      const [response1, response2] = await Promise.all([
        fetchWithTimeout('https://jsonplaceholder.typicode.com/posts/1', 5000),
        fetchWithTimeout('https://jsonplaceholder.typicode.com/posts/2', 5000)
      ])

      const data1: ApiData = await response1.json()
      const data2: ApiData = await response2.json()

      setData([data1, data2])
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Async/Await Demo</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading...</span>
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
        {data.length > 0 && (
          <ul className="list-disc pl-5">
            {data.map((item) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        )}
        <Button onClick={fetchData} disabled={loading} className="mt-4">
          Refresh Data
        </Button>
      </CardContent>
    </Card>
  )
}

