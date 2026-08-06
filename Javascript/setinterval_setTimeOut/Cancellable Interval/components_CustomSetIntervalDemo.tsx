'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function customSetInterval(callback: () => void, interval: number) {
  let timerId: NodeJS.Timeout;

  function repeat() {
    callback();
    timerId = setTimeout(repeat, interval);
  }

  repeat(); // Start the interval immediately

  // Return the cancellation function
  return function cancelInterval() {
    clearTimeout(timerId);
  };
}

export default function CustomSetIntervalDemo() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const cancelIntervalRef = useRef<(() => void) | null>(null);

  const addLog = useCallback((message: string) => {
    setLogs(prevLogs => [...prevLogs, `${new Date().toLocaleTimeString()}: ${message}`]);
  }, []);

  const startInterval = () => {
    if (isRunning) return;

    setIsRunning(true);
    let count = 0;

    cancelIntervalRef.current = customSetInterval(() => {
      count++;
      addLog(`Interval tick ${count}`);
    }, 1000);
  };

  const stopInterval = () => {
    if (!isRunning || !cancelIntervalRef.current) return;

    cancelIntervalRef.current();
    cancelIntervalRef.current = null;
    setIsRunning(false);
    addLog('Interval stopped');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Custom setInterval Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Button onClick={startInterval} disabled={isRunning}>
            Start Interval
          </Button>
          <Button onClick={stopInterval} disabled={!isRunning}>
            Stop Interval
          </Button>
        </div>
        <div className="h-64 overflow-y-auto border border-gray-200 rounded p-2">
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

