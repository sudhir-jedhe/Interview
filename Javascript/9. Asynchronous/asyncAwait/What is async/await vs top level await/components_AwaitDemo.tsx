'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchData, processData, saveData } from '../utils/asyncOperations'

// This would typically be in a separate file (e.g., topLevelAwait.ts)
// We're including it here for demonstration purposes
const topLevelData = await fetchData();
const topLevelProcessed = await processData(topLevelData);
const topLevelSaved = await saveData(topLevelProcessed);

export default function AwaitDemo() {
  const [functionResult, setFunctionResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log('Top-level await result:', topLevelSaved);
  }, []);

  const runAsyncFunction = async () => {
    setLoading(true)
    try {
      const data = await fetchData();
      const processed = await processData(data);
      const saved = await saveData(processed);
      setFunctionResult(saved);
    } catch (error) {
      setFunctionResult(`Error: ${error.message}`);
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Await Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold">Top-Level Await Result:</h3>
            <p>{topLevelSaved}</p>
          </div>
          <div>
            <h3 className="font-bold">Async Function Result:</h3>
            <Button onClick={runAsyncFunction} disabled={loading}>
              {loading ? 'Running...' : 'Run Async Function'}
            </Button>
            {functionResult && (
              <p className="mt-2">{functionResult}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

