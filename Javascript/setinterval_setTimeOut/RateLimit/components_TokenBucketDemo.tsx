'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RateLimiter } from '../utils/RateLimiter'

export default function TokenBucketDemo() {
  const [rateLimiter, setRateLimiter] = useState<RateLimiter | null>(null);
  const [capacity, setCapacity] = useState(10);
  const [refillRate, setRefillRate] = useState(1);
  const [interval, setInterval] = useState(1000);
  const [tokens, setTokens] = useState(capacity);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const limiter = new RateLimiter(capacity, refillRate, interval);
    setRateLimiter(limiter);
    setTokens(capacity);

    return () => {
      limiter.stopRefill();
    };
  }, [capacity, refillRate, interval]);

  useEffect(() => {
    if (rateLimiter) {
      const timer = setInterval(() => {
        setTokens(rateLimiter.getTokens());
      }, 100);

      return () => clearInterval(timer);
    }
  }, [rateLimiter]);

  const makeRequest = useCallback(() => {
    if (rateLimiter) {
      const allowed = rateLimiter.allowRequest();
      const message = allowed ? "Request allowed" : "Request blocked";
      setLogs(prevLogs => [`${new Date().toLocaleTimeString()}: ${message}`, ...prevLogs.slice(0, 9)]);
    }
  }, [rateLimiter]);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Token Bucket Rate Limiter Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity</label>
            <Input
              id="capacity"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              min={1}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="refillRate" className="block text-sm font-medium text-gray-700">Refill Rate (tokens/s)</label>
            <Input
              id="refillRate"
              type="number"
              value={refillRate}
              onChange={(e) => setRefillRate(Number(e.target.value))}
              min={0.1}
              step={0.1}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="interval" className="block text-sm font-medium text-gray-700">Interval (ms)</label>
            <Input
              id="interval"
              type="number"
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              min={100}
              step={100}
            />
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Tokens: {tokens.toFixed(2)}</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(tokens / capacity) * 100}%` }}></div>
          </div>
        </div>
        <Button onClick={makeRequest} className="w-full">Make Request</Button>
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

