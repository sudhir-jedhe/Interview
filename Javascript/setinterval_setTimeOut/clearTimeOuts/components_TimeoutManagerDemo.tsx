'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTimeoutManager } from '../hooks/useTimeoutManager'

export default function TimeoutManagerDemo() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { setCustomTimeout, clearAllTimeouts } = useTimeoutManager();

  const addLog = useCallback((message: string) => {
    setLogs(prevLogs => [...prevLogs, `${new Date().toLocaleTimeString()}: ${message}`]);
  }, []);

  const startTimeouts = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);
    addLog('Starting timeouts...');

    setCustomTimeout(() => {
      addLog('Timeout 1 executed (1s delay)');
    }, 1000);

    setCustomTimeout(() => {
      addLog('Timeout 2 executed (2s delay)');
    }, 2000);

    setCustomTimeout(() => {
      addLog('Timeout 3 executed (3s delay)');
    }, 3000);

    setCustomTimeout(() => {
      addLog('All timeouts completed');
      setIsRunning(false);
    }, 3100);
  }, [isRunning, addLog, setCustomTimeout]);

  const stopTimeouts = useCallback(() => {
    clearAllTimeouts();
    setIsRunning(false);
    addLog('All timeouts cleared');
  }, [clearAllTimeouts, addLog]);

  useEffect(() => {
    return () => {
      clearAllTimeouts(); // Clean up on unmount
    };
  }, [clearAllTimeouts]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Timeout Manager Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Button onClick={startTimeouts} disabled={isRunning}>
            Start Timeouts
          </Button>
          <Button onClick={stopTimeouts} disabled={!isRunning}>
            Clear All Timeouts
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

