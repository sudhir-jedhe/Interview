'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createAsyncTask, asyncParallel, asyncParallelWithTimeout, asyncParallelWithAwait } from '../utils/taskUtils'

export default function ParallelTasksDemo() {
  const [results, setResults] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const tasks = [
    createAsyncTask(3),
    createAsyncTask(1),
    createAsyncTask(2),
  ]

  const runBasicParallel = () => {
    setLoading(true)
    setResults([])
    setErrors([])
    asyncParallel(tasks, (errs, res) => {
      setErrors(errs)
      setResults(res)
      setLoading(false)
    })
  }

  const runParallelWithTimeout = () => {
    setLoading(true)
    setResults([])
    setErrors([])
    asyncParallelWithTimeout(tasks, (errs, res) => {
      setErrors(errs)
      setResults(res)
      setLoading(false)
    })
  }

  const runParallelWithAwait = async () => {
    setLoading(true)
    setResults([])
    setErrors([])
    try {
      const res = await asyncParallelWithAwait(tasks)
      setResults(res)
    } catch (error) {
      setErrors([error.toString()])
    }
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Parallel Tasks Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={runBasicParallel} disabled={loading}>Run Basic Parallel</Button>
          <Button onClick={runParallelWithTimeout} disabled={loading}>Run Parallel with Timeout</Button>
          <Button onClick={runParallelWithAwait} disabled={loading}>Run Parallel with Await</Button>
          
          {loading && <p>Loading...</p>}
          
          {results.length > 0 && (
            <div>
              <h3 className="font-bold">Results:</h3>
              <ul className="list-disc pl-5">
                {results.map((result, index) => (
                  <li key={index}>{result}</li>
                ))}
              </ul>
            </div>
          )}
          
          {errors.length > 0 && (
            <div>
              <h3 className="font-bold text-red-500">Errors:</h3>
              <ul className="list-disc pl-5">
                {errors.map((error, index) => (
                  <li key={index} className="text-red-500">{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

