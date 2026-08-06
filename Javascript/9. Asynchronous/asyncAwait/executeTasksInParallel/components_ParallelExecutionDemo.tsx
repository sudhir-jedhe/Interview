'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { executeTasksInParallel, fetchUrlsInParallel } from '../utils/parallelExecution'

const task1 = () => new Promise<string>(resolve => setTimeout(() => resolve('Task 1 completed'), 1000));
const task2 = () => new Promise<string>(resolve => setTimeout(() => resolve('Task 2 completed'), 2000));
const task3 = () => new Promise<string>(resolve => setTimeout(() => resolve('Task 3 completed'), 1500));

const apiUrls = [
  'https://jsonplaceholder.typicode.com/posts/1',
  'https://jsonplaceholder.typicode.com/posts/2',
  'https://jsonplaceholder.typicode.com/posts/3'
];

export default function ParallelExecutionDemo() {
  const [taskResults, setTaskResults] = useState<string[]>([]);
  const [urlResults, setUrlResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await executeTasksInParallel([task1, task2, task3]);
      setTaskResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUrls = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await fetchUrlsInParallel(apiUrls);
      setUrlResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Parallel Execution Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={runTasks} disabled={loading}>Run Parallel Tasks</Button>
          <Button onClick={fetchUrls} disabled={loading}>Fetch URLs in Parallel</Button>
          
          {loading && <p>Loading...</p>}
          
          {error && <p className="text-red-500">Error: {error}</p>}
          
          {taskResults.length > 0 && (
            <div>
              <h3 className="font-bold">Task Results:</h3>
              <ul className="list-disc pl-5">
                {taskResults.map((result, index) => (
                  <li key={index}>{result}</li>
                ))}
              </ul>
            </div>
          )}
          
          {urlResults.length > 0 && (
            <div>
              <h3 className="font-bold">URL Fetch Results:</h3>
              <ul className="list-disc pl-5">
                {urlResults.map((result, index) => (
                  <li key={index}>
                    {result.error ? (
                      <span className="text-red-500">Error: {result.error}</span>
                    ) : (
                      <span>Post {result.id}: {result.title}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

