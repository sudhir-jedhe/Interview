'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { timeLimit } from '../utils/timeLimit'

const simulateAsyncTask = (delay: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.1) {
        reject("Random error occurred");
      } else {
        resolve(`Task completed after ${delay}ms`);
      }
    }, delay);
  });
};

export default function TimeLimitDemo() {
  const [taskDelay, setTaskDelay] = useState(1000)
  const [timeLimit, setTimeLimit] = useState(1500)
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const runTask = async () => {
    setLoading(true)
    setResult('')
    const timeLimitedTask = timeLimit(simulateAsyncTask, timeLimit)
    try {
      const result = await timeLimitedTask(taskDelay)
      setResult(result)
    } catch (error) {
      setResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Time Limit Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="task-delay">Task Delay (ms)</Label>
            <Input
              id="task-delay"
              type="number"
              value={taskDelay}
              onChange={(e) => setTaskDelay(Number(e.target.value))}
              min={0}
            />
          </div>
          <div>
            <Label htmlFor="time-limit">Time Limit (ms)</Label>
            <Input
              id="time-limit"
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              min={0}
            />
          </div>
          <Button onClick={runTask} disabled={loading}>
            {loading ? 'Running...' : 'Run Task'}
          </Button>
          {result && (
            <div className={`p-2 rounded-md ${result.startsWith('Error') ? 'bg-red-100' : 'bg-green-100'}`}>
              {result}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

