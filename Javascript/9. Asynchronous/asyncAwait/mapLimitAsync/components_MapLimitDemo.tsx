'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { mapLimit } from '../utils/mapLimit'

export default function MapLimitDemo() {
  const [input, setInput] = useState('1,2,3,4,5')
  const [limit, setLimit] = useState(3)
  const [delay, setDelay] = useState(2000)
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, message])
  }

  const handleMapLimit = async () => {
    setLoading(true)
    setResult('')
    setLogs([])

    const numbers = input.split(',').map(Number)

    try {
      const result = await mapLimit(numbers, limit, (num, callback) => {
        setTimeout(() => {
          const doubled = num * 2
          addLog(`Processing ${num} -> ${doubled}`)
          if (doubled === 6) {
            callback(new Error('Error: number is 6'))
          } else {
            callback(null, doubled)
          }
        }, delay)
      })
      setResult(`Success: ${JSON.stringify(result)}`)
    } catch (error) {
      setResult(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>mapLimit Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="input">Input (comma-separated numbers)</Label>
            <Input
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., 1,2,3,4,5"
            />
          </div>
          <div>
            <Label htmlFor="limit">Concurrency Limit</Label>
            <Input
              id="limit"
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              min={1}
            />
          </div>
          <div>
            <Label htmlFor="delay">Delay (ms)</Label>
            <Input
              id="delay"
              type="number"
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              min={0}
            />
          </div>
          <Button onClick={handleMapLimit} disabled={loading}>
            {loading ? 'Processing...' : 'Run mapLimit'}
          </Button>
          {logs.length > 0 && (
            <div>
              <Label>Logs:</Label>
              <div className="bg-gray-100 p-2 rounded-md max-h-40 overflow-auto">
                {logs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
              </div>
            </div>
          )}
          {result && (
            <div>
              <Label>Result:</Label>
              <div className={`p-2 rounded-md ${result.startsWith('Success') ? 'bg-green-100' : 'bg-red-100'}`}>
                {result}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

