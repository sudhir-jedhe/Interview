'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createSetIntervalPolyfill, customSetInterval } from '../utils/customSetInterval'

export default function CustomSetIntervalDemo() {
  const [polyfillLogs, setPolyfillLogs] = useState<string[]>([]);
  const [promiseLogs, setPromiseLogs] = useState<string[]>([]);
  const [isPolyfillRunning, setIsPolyfillRunning] = useState(false);
  const [isPromiseRunning, setIsPromiseRunning] = useState(false);

  const addPolyfillLog = useCallback((message: string) => {
    setPolyfillLogs(prevLogs => [`${new Date().toLocaleTimeString()}: ${message}`, ...prevLogs.slice(0, 9)]);
  }, []);

  const addPromiseLog = useCallback((message: string) => {
    setPromiseLogs(prevLogs => [`${new Date().toLocaleTimeString()}: ${message}`, ...prevLogs.slice(0, 9)]);
  }, []);

  const startPolyfillInterval = useCallback(() => {
    if (isPolyfillRunning) return;

    setIsPolyfillRunning(true);
    addPolyfillLog('Starting polyfill interval...');

    const { setIntervalPolyfill, clearIntervalPolyfill } = createSetIntervalPolyfill();
    let counter = 0;

    const intervalId = setIntervalPolyfill(() => {
      counter++;
      addPolyfillLog(`Polyfill execution ${counter}`);
      if (counter >= 5) {
        clearIntervalPolyfill(intervalId);
        setIsPolyfillRunning(false);
        addPolyfillLog('Polyfill interval stopped');
      }
    }, 1000);
  }, [isPolyfillRunning, addPolyfillLog]);

  const startPromiseInterval = useCallback(() => {
    if (isPromiseRunning) return;

    setIsPromiseRunning(true);
    addPromiseLog('Starting promise-based interval...');

    let counter = 0;
    const [promise, cancel] = customSetInterval(() => {
      counter++;
      addPromiseLog(`Promise-based execution ${counter}`);
      if (counter >= 5) {
        return false; // Stop the interval
      }
    }, 1000);

    promise.then((message) => {
      setIsPromiseRunning(false);
      addPromiseLog(message);
    }).catch((error) => {
      setIsPromiseRunning(false);
      addPromiseLog(`Error: ${error.message}`);
    });

    // Optionally cancel after 3 seconds
    setTimeout(() => {
      if (counter < 3) {
        cancel();
        setIsPromiseRunning(false);
        addPromiseLog('Promise-based interval canceled manually');
      }
    }, 3000);
  }, [isPromiseRunning, addPromiseLog]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Custom setInterval Demonstration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Polyfill Version</h3>
            <Button onClick={startPolyfillInterval} disabled={isPolyfillRunning}>
              {isPolyfillRunning ? 'Running...' : 'Start Polyfill Interval'}
            </Button>
            <div className="h-48 overflow-y-auto border border-gray-200 rounded p-2 mt-2">
              {polyfillLogs.map((log, index) => (
                <p key={index} className="text-sm">
                  {log}
                </p>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Promise-based Version</h3>
            <Button onClick={startPromiseInterval} disabled={isPromiseRunning}>
              {isPromiseRunning ? 'Running...' : 'Start Promise Interval'}
            </Button>
            <div className="h-48 overflow-y-auto border border-gray-200 rounded p-2 mt-2">
              {promiseLogs.map((log, index) => (
                <p key={index} className="text-sm">
                  {log}
                </p>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

