'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { simulateTask, fetchWithTimeout } from '../utils/raceConditionUtils'

type TaskResult = {
  taskId: string;
  result: string;
  status: 'pending' | 'success' | 'error';
}

export default function RaceConditionDemo() {
  const [tasks, setTasks] = useState<TaskResult[]>([])
  const [urls, setUrls] = useState<string[]>([])
  const [newUrl, setNewUrl] = useState('')

  const runSimpleTasks = async () => {
    const taskConfigs = [
      { id: '1', duration: 2000 },
      { id: '2', duration: 1000 },
      { id: '3', duration: 1500 }
    ]

    setTasks(taskConfigs.map(t => ({ taskId: t.id, result: '', status: 'pending' })))

    try {
      const winner = await Promise.race(taskConfigs.map(task => 
        simulateTask(task.id, task.duration).then(result => {
          setTasks(prev => prev.map(t => t.taskId === task.id ? { ...t, result, status: 'success' } : t))
          return result
        })
      ))
      console.log("Race completed. Winner:", winner)
    } catch (error) {
      console.error("Error in race:", error)
    }
  }

  const runTasksWithTimeout = async () => {
    const taskConfigs = [
      { id: '1', duration: 2000 },
      { id: '2', duration: 1500 },
      { id: '3', duration: 3000 },
      { id: '4', duration: 1000 }
    ]

    setTasks(taskConfigs.map(t => ({ taskId: t.id, result: '', status: 'pending' })))

    for (const task of taskConfigs) {
      try {
        const result = await Promise.race([
          simulateTask(task.id, task.duration),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Task timed out')), 2500))
        ])
        setTasks(prev => prev.map(t => t.taskId === task.id ? { ...t, result, status: 'success' } : t))
      } catch (error) {
        setTasks(prev => prev.map(t => t.taskId === task.id ? { ...t, result: error.message, status: 'error' } : t))
      }
    }
  }

  const fetchUrls = async () => {
    setTasks(urls.map((_, index) => ({ taskId: `URL ${index + 1}`, result: '', status: 'pending' })))

    const results = await Promise.all(urls.map((url, index) => 
      fetchWithTimeout(url, 5000)
        .then(data => {
          setTasks(prev => prev.map(t => t.taskId === `URL ${index + 1}` ? { ...t, result: JSON.stringify(data), status: 'success' } : t))
          return data
        })
        .catch(error => {
          setTasks(prev => prev.map(t => t.taskId === `URL ${index + 1}` ? { ...t, result: error.message, status: 'error' } : t))
          return { error: error.message }
        })
    ))

    console.log('API calls completed:', results)
  }

  const addUrl = () => {
    if (newUrl) {
      setUrls(prev => [...prev, newUrl])
      setNewUrl('')
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Race Condition Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={runSimpleTasks}>Run Simple Tasks</Button>
          <Button onClick={runTasksWithTimeout}>Run Tasks with Timeout</Button>
          <div>
            <Label htmlFor="url-input">Add URL</Label>
            <div className="flex mt-1">
              <Input
                id="url-input"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="Enter URL"
              />
              <Button onClick={addUrl} className="ml-2">Add</Button>
            </div>
          </div>
          {urls.length > 0 && (
            <div>
              <h3 className="font-bold">URLs to fetch:</h3>
              <ul className="list-disc pl-5">
                {urls.map((url, index) => (
                  <li key={index}>{url}</li>
                ))}
              </ul>
              <Button onClick={fetchUrls} className="mt-2">Fetch URLs</Button>
            </div>
          )}
          <div>
            <h3 className="font-bold">Task Results:</h3>
            {tasks.map((task) => (
              <div key={task.taskId} className="mt-2">
                <strong>{task.taskId}:</strong> 
                <span className={task.status === 'error' ? 'text-red-500' : task.status === 'success' ? 'text-green-500' : 'text-yellow-500'}>
                  {task.status === 'pending' ? 'Pending' : task.result}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

