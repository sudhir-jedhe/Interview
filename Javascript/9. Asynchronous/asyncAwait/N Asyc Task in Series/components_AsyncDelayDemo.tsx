'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

function waitForMe(millisec: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("")
    }, millisec)
  })
}

export default function AsyncDelayDemo() {
  const [count, setCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  const printy = useCallback(async () => {
    for (let i = 0; i <= 10; i++) {
      if (!isRunning) break
      await waitForMe(1000)
      setCount(i)
      setProgress(i * 10)
    }
    setIsRunning(false)
  }, [isRunning])

  useEffect(() => {
    if (isRunning) {
      printy()
    }
  }, [isRunning, printy])

  const handleStart = () => setIsRunning(true)
  const handleStop = () => setIsRunning(false)

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Async Delay Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <span className="text-4xl font-bold">{count}</span>
        </div>
        <Progress value={progress} className="mb-4" />
        <div className="flex justify-between">
          <Button onClick={handleStart} disabled={isRunning}>
            Start
          </Button>
          <Button onClick={handleStop} disabled={!isRunning} variant="secondary">
            Stop
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

