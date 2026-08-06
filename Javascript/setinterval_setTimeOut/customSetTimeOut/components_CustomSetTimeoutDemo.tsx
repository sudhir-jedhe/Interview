'use client'

import React, { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function customSetTimeout(callback: () => any, delay: number): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof callback !== 'function') {
      return reject(new TypeError('Callback must be a function'));
    }
    if (typeof delay !== 'number' || delay < 0) {
      return reject(new TypeError('Delay must be a non-negative number'));
    }

    const timeoutId = setTimeout(() => {
      try {
        const result = callback();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  });
}

export default function CustomSetTimeoutDemo() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [cancelTimeout, setCancelTimeout] = useState<(() => void) | null>(null);

  const addLog = useCallback((message: string) => {
    setLogs(prevLogs => [...prevLogs, `${new Date().toLocaleTimeString()}: ${message}`]);
  }, []);

  const startTimeout = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);
    addLog('Starting timeout...');

    const timeoutFunction = customSetTimeout(() => {
      addLog('Executed after delay');
      return 'Success!';
    }, 5000);

    timeoutFunction
      .then(result => {
        addLog(`Callback result: ${result}`);
        setIsRunning(false);
      })
      .catch(error => {
        addLog(`Error: ${error.message}`);
        setIsRunning(false);
      });

    const cancelFunc = timeoutFunction();
    setCancelTimeout(() => () => {
      cancelFunc();
      addLog('Timeout canceled');
      setIsRunning(false);
    });
  }, [addLog, isRunning]);

  const handleCancel = useCallback(() => {
    if (cancelTimeout) {
      cancelTimeout();
      setCancelTimeout(null);
    }
  }, [cancelTimeout]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Custom setTimeout Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Button onClick={startTimeout} disabled={isRunning}>
            Start Timeout
          </Button>
          <Button onClick={handleCancel} disabled={!isRunning}>
            Cancel Timeout
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

