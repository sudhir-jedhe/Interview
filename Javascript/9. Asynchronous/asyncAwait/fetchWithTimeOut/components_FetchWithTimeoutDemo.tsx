'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fetchWithTimeout } from '../utils/fetchWithTimeout'

export default function FetchWithTimeoutDemo() {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1')
  const [timeout, setTimeout] = useState(1000)
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleFetch = async () => {
    setLoading(true)
    setResult('')
    try {
      const data = await fetchWithTimeout(url, {}, timeout)
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Fetch With Timeout Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to fetch"
            />
          </div>
          <div>
            <Label htmlFor="timeout">Timeout (ms)</Label>
            <Input
              id="timeout"
              type="number"
              value={timeout}
              onChange={(e) => setTimeout(Number(e.target.value))}
              min={0}
            />
          </div>
          <Button onClick={handleFetch} disabled={loading}>
            {loading ? 'Fetching...' : 'Fetch Data'}
          </Button>
          {result && (
            <div className="mt-4">
              <Label>Result:</Label>
              <pre className="bg-gray-100 p-2 rounded-md overflow-auto max-h-60">
                {result}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

