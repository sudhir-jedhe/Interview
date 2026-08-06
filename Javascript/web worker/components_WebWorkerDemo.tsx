'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function WebWorkerDemo() {
  const [count, setCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
      }
    }
  }, [])

  const startWorker = () => {
    if (typeof Worker !== "undefined") {
      if (!workerRef.current) {
        workerRef.current = new Worker('/counter-worker.js')
        workerRef.current.onmessage = (e: MessageEvent) => {
          setCount(e.data)
        }
        workerRef.current.onerror = (error: ErrorEvent) => {
          setError(`Error in worker: ${error.message}`)
          stopWorker()
        }
      }
      workerRef.current.postMessage('start')
      setIsRunning(true)
      setError(null)
    } else {
      setError("Sorry! Your browser does not support Web Workers.")
    }
  }

  const stopWorker = () => {
    if (workerRef.current) {
      workerRef.current.terminate()
      workerRef.current = null
      setIsRunning(false)
    }
  }

  const resetWorker = () => {
    if (workerRef.current) {
      workerRef.current.postMessage('reset')
    } else {
      setCount(0)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Web Worker Counter Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-4xl font-bold text-center">{count}</div>
        <div className="flex justify-center space-x-2">
          <Button onClick={startWorker} disabled={isRunning}>
            {isRunning ? 'Running' : 'Start'}
          </Button>
          <Button onClick={stopWorker} disabled={!isRunning}>
            Stop
          </Button>
          <Button onClick={resetWorker}>Reset</Button>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

