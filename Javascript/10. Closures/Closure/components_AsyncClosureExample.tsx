'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AsyncClosureExample() {
  const [count, setCount] = useState(5)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (isRunning && count > 0) {
      // This is a closure that "remembers" the count state
      timer = setTimeout(() => {
        setCount((prevCount) => prevCount - 1)
      }, 1000)
    } else if (count === 0) {
      setIsRunning(false)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [count, isRunning])

  const startCountdown = () => {
    setCount(5)
    setIsRunning(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asynchronous Closure Example (Countdown)</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Countdown: {count}</p>
        <Button onClick={startCountdown} disabled={isRunning}>
          {isRunning ? 'Counting down...' : 'Start Countdown'}
        </Button>
      </CardContent>
    </Card>
  )
}

