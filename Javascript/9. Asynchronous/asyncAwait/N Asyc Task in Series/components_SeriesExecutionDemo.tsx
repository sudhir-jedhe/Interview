'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { runTasksInSeries, asyncSeriesExecuter, recursiveSeriesExecuter, fetchUrlsInSerial } from '../utils/seriesExecutors'

const createAsyncTask = (id: number, delay: number) => () => 
  new Promise<string>(resolve => 
    setTimeout(() => resolve(`Task ${id} completed after ${delay}ms`), delay)
  );

export default function SeriesExecutionDemo() {
  const [taskCount, setTaskCount] = useState(3)
  const [taskDelay, setTaskDelay] = useState(1000)
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [executionTime, setExecutionTime] = useState(0)

  const runTasks = async (executor: (tasks: (() => Promise<any>)[]) => Promise<any[]>) => {
    setLoading(true)
    setResults([])
    const tasks = Array.from({ length: taskCount }, (_, i) => createAsyncTask(i + 1, taskDelay))
    const startTime = performance.now()
    try {
      const results = await executor(tasks)
      setResults(results)
    } catch (error) {
      console.error('Error executing tasks:', error)
    } finally {
      setExecutionTime(performance.now() - startTime)
      setLoading(false)
    }
  }

  const runUrlFetch = async () => {
    setLoading(true)
    setResults([])
    const urls = [
      'https://jsonplaceholder.typicode.com/posts/1',
      'https://jsonplaceholder.typicode.com/posts/2',
      'https://jsonplaceholder.typicode.com/posts/3'
    ]
    const startTime = performance.now()
    try {
      const results = await fetchUrlsInSerial(urls)
      setResults(results.map(r => JSON.stringify(r)))
    } catch (error) {
      console.error('Error fetching URLs:', error)
    } finally {
      setExecutionTime(performance.now() - startTime)
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Series Execution Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="task-count">Number of Tasks</Label>
            <Input
              id="task-count"
              type="number"
              value={taskCount}
              onChange={(e) => setTaskCount(Number(e.target.value))}
              min={1}
            />
          </div>
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
          <div className="space-x-2">
            <Button onClick={() => runTasks(runTasksInSeries)} disabled={loading}>
              Run with async/await
            </Button>
            <Button onClick={() => runTasks(asyncSeriesExecuter)} disabled={loading}>
              Run with reduce
            </Button>
            <Button onClick={() => runTasks(recursiveSeriesExecuter)} disabled={loading}>
              Run with recursion
            </Button>
            <Button onClick={runUrlFetch} disabled={loading}>
              Fetch URLs
            </Button>
          </div>
          {loading && <div>Executing tasks...</div>}
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
          {executionTime > 0 && (
            <div>Execution time: {executionTime.toFixed(2)}ms</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

