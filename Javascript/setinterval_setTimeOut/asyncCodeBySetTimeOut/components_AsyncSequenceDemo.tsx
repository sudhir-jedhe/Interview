'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Simulated asynchronous functions
const asyncFunc1 = () => new Promise<void>(resolve => {
  console.log("Started asyncFunc1");
  setTimeout(() => {
    console.log("Completed asyncFunc1");
    resolve();
  }, 3000);
});

const asyncFunc2 = () => new Promise<void>(resolve => {
  console.log("Started asyncFunc2");
  setTimeout(() => {
    console.log("Completed asyncFunc2");
    resolve();
  }, 2000);
});

const asyncFunc3 = () => new Promise<void>(resolve => {
  console.log("Started asyncFunc3");
  setTimeout(() => {
    console.log("Completed asyncFunc3");
    resolve();
  }, 1000);
});

export default function AsyncSequenceDemo() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (message: string) => {
    setLogs(prevLogs => [...prevLogs, message]);
  };

  const runAsyncSequence = async () => {
    setIsRunning(true);
    setLogs([]);

    try {
      addLog("Started asyncFunc1");
      await asyncFunc1();
      addLog("Completed asyncFunc1");

      addLog("Started asyncFunc2");
      await asyncFunc2();
      addLog("Completed asyncFunc2");

      addLog("Started asyncFunc3");
      await asyncFunc3();
      addLog("Completed asyncFunc3");
    } catch (error) {
      addLog(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Asynchronous Sequence Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={runAsyncSequence} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Run Async Sequence'}
        </Button>
        <div className="mt-4 h-64 overflow-y-auto border border-gray-200 rounded p-2">
          {logs.map((log, index) => (
            <p key={index} className="text-sm">
              {log}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

