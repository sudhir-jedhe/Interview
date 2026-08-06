'use client'

import React, { useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const unwind = (key: string, obj: Record<string, any>) => {
  const { [key]: _, ...rest } = obj;
  
  // If obj[key] is not an array, return an empty array
  if (!Array.isArray(obj[key])) {
    return [];
  }
  
  return obj[key].map((val: any) => ({ ...rest, [key]: val }));
};

export default function UnwindDemo() {
  const [inputObj, setInputObj] = useState('{"a": true, "b": [1, 2]}')
  const [inputKey, setInputKey] = useState('b')
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const handleUnwind = () => {
    try {
      const obj = JSON.parse(inputObj)
      const unwoundResult = unwind(inputKey, obj)
      setResult(JSON.stringify(unwoundResult, null, 2))
      setError(null)
    } catch (err) {
      setError('Invalid JSON input or key. Please check your input and try again.')
      setResult('')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Unwind Function Demo</CardTitle>
        <CardDescription>Unwind an array-valued property within an object</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Input Object:</label>
            <Textarea
              value={inputObj}
              onChange={(e) => setInputObj(e.target.value)}
              placeholder="Enter object as JSON"
              rows={5}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Key to Unwind:</label>
            <Input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Enter key to unwind"
            />
          </div>
          <Button onClick={handleUnwind}>Unwind</Button>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {result && (
            <div>
              <label className="block mb-2 text-sm font-medium">Result:</label>
              <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                {result}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

