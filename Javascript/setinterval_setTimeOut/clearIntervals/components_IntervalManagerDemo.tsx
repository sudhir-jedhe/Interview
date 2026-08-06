'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useIntervalManager } from '../hooks/useIntervalManager'

export default function IntervalManagerDemo() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { setCustomInterval, clearAllIntervals } = useIntervalManager();

  const addLog = useCallback((message: string) => {
    setLogs(prevLogs => [...prevLogs, `${new Date().toLocaleTimeString()}: ${message}`]);
  }, []);

  const startIntervals = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);
    addLog('Starting intervals...');

    setCustomInterval(() => {
      addLog('Hello (2s interval)');
    }, 2000);

    setCustomInterval(() => {
      addLog('Hello2 (500ms interval)');
    }, 500);

    setCustomInterval(() => {
      addLog('Hello3 (1s interval)');
    }, 1000);
  }, [isRunning, addLog, setCustomInterval]);

  const stopIntervals = useCallback(() => {
    clearAllIntervals();
    setIsRunning(false);
    addLog('All intervals cleared');
  }, [clearAllIntervals, addLog]);

  useEffect(() => {
    return () => {
      clearAllIntervals(); // Clean up on unmount
    };
  }, [clearAllIntervals]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Interval Manager Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Button onClick={startIntervals} disabled={isRunning}>
            Start Intervals
          </Button>
          <Button onClick={stopIntervals} disabled={!isRunning}>
            Clear All Intervals
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

