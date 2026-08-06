'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fetchWithAutoRetry } from '../utils/fetchWithAutoRetry'

export default function FetchWithAutoRetryDemo() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [retryCount, setRetryCount] = useState(3)
  const [failureRate, setFailureRate] = useState(50)

  const simulateFetch = () => {
    return new Promise<string>((resolve, reject) => {
      const shouldFail = Math.random() * 100 < failureRate
      setTimeout(() => {
        if (shouldFail) reject("Network error")
        else resolve("Data fetched successfully")
      }, 1000)
    })
  }

  const handleFetch = async () => {
    setLoading(true)
    setResult('')
    try {
      const data = await fetchWithAutoRetry(simulateFetch, retryCount)
      setResult(`Success: ${data}`)
    } catch (error) {
      setResult(`Failed after retries: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Fetch With Auto Retry Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="retry-count">Maximum Retry Count</Label>
            <Input
              id="retry-count"
              type="number"
              value={retryCount}
              onChange={(e) => setRetryCount(Number(e.target.value))}
              min={0}
            />
          </div>
          <div>
            <Label htmlFor="failure-rate">Failure Rate (%)</Label>
            <Input
              id="failure-rate"
              type="number"
              value={failureRate}
              onChange={(e) => setFailureRate(Number(e.target.value))}
              min={0}
              max={100}
            />
          </div>
          <Button onClick={handleFetch} disabled={loading}>
            {loading ? 'Fetching...' : 'Fetch Data'}
          </Button>
          {result && (
            <div className={result.startsWith('Success') ? 'text-green-500' : 'text-red-500'}>
              {result}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

