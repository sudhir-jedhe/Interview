'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { syncOperation, asyncOperation, simulateAPICall } from '../utils/asyncSyncOperations'

export default function AsyncSyncDemo() {
  const [iterations, setIterations] = useState(1000000)
  const [apiDelay, setApiDelay] = useState(2000)
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const runSyncOperation = () => {
    setLoading(true)
    const startTime = performance.now()
    const result = syncOperation(iterations)
    const endTime = performance.now()
    setResults(prev => [...prev, `Sync Operation: ${result.toFixed(2)} (${(endTime - startTime).toFixed(2)}ms)`])
    setLoading(false)
  }

  const runAsyncOperation = async () => {
    setLoading(true)
    const startTime = performance.now()
    const result = await asyncOperation(iterations)
    const endTime = performance.now()
    setResults(prev => [...prev, `Async Operation: ${result.toFixed(2)} (${(endTime - startTime).toFixed(2)}ms)`])
    setLoading(false)
  }

  const runAPICall = async () => {
    setLoading(true)
    const startTime = performance.now()
    const result = await simulateAPICall(apiDelay)
    const endTime = performance.now()
    setResults(prev => [...prev, `${result} (${(endTime - startTime).toFixed(2)}ms)`])
    setLoading(false)
  }

  const runMultipleAPICalls = async () => {
    setLoading(true)
    const startTime = performance.now()
    const results = await Promise.all([
      simulateAPICall(apiDelay),
      simulateAPICall(apiDelay),
      simulateAPICall(apiDelay)
    ])
    const endTime = performance.now()
    setResults(prev => [
      ...prev,
      ...results.map(result => `${result} (Parallel)`),
      `Total time for parallel calls: ${(endTime - startTime).toFixed(2)}ms`
    ])
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Async vs Sync Operations Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="iterations">Iterations for Sync/Async Operations</Label>
            <Input
              id="iterations"
              type="number"
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              min={1}
            />
          </div>
          <div>
            <Label htmlFor="api-delay">API Call Delay (ms)</Label>
            <Input
              id="api-delay"
              type="number"
              value={apiDelay}
              onChange={(e) => setApiDelay(Number(e.target.value))}
              min={0}
            />
          </div>
          <div className="space-x-2">
            <Button onClick={runSyncOperation} disabled={loading}>Run Sync Operation</Button>
            <Button onClick={runAsyncOperation} disabled={loading}>Run Async Operation</Button>
            <Button onClick={runAPICall} disabled={loading}>Simulate API Call</Button>
            <Button onClick={runMultipleAPICalls} disabled={loading}>Run Multiple API Calls</Button>
          </div>
          {loading && <div>Operation in progress...</div>}
          {results.length > 0 && (
            <div>
              <Label>Results:</Label>
              <div className="bg-gray-100 p-2 rounded-md max-h-60 overflow-auto">
                {results.map((result, index) => (
                  <div key={index}>{result}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

