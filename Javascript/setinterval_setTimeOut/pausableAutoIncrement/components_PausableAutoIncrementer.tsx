'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const createTimer = (init = 0, step = 1) => {
  let intervalId: NodeJS.Timeout | null = null;
  let count = init;

  const startTimer = (callback: (count: number) => void) => {
    if (!intervalId) {
      intervalId = setInterval(() => {
        callback(count);
        count += step;
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const getCount = () => count;

  const setCount = (newCount: number) => {
    count = newCount;
  };

  const setStep = (newStep: number) => {
    step = newStep;
  };

  return {
    startTimer,
    stopTimer,
    getCount,
    setCount,
    setStep,
  };
};

export default function PausableAutoIncrementer() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [initialValue, setInitialValue] = useState(0);
  const [stepSize, setStepSize] = useState(1);
  const timerRef = React.useRef(createTimer(initialValue, stepSize));

  useEffect(() => {
    return () => {
      timerRef.current.stopTimer();
    };
  }, []);

  const startIncrementer = useCallback(() => {
    setIsRunning(true);
    timerRef.current.startTimer((newCount) => {
      setCount(newCount);
    });
  }, []);

  const pauseIncrementer = useCallback(() => {
    setIsRunning(false);
    timerRef.current.stopTimer();
  }, []);

  const resetIncrementer = useCallback(() => {
    pauseIncrementer();
    timerRef.current.setCount(initialValue);
    timerRef.current.setStep(stepSize);
    setCount(initialValue);
  }, [initialValue, stepSize, pauseIncrementer]);

  const handleInitialValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    setInitialValue(value);
  };

  const handleStepSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 1;
    setStepSize(value);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Pausable Auto Incrementer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-3xl font-bold text-center">{count}</div>
        <div className="flex space-x-2">
          <Button onClick={startIncrementer} disabled={isRunning}>
            {isRunning ? 'Running' : 'Start'}
          </Button>
          <Button onClick={pauseIncrementer} disabled={!isRunning}>
            Pause
          </Button>
          <Button onClick={resetIncrementer}>Reset</Button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <label htmlFor="initialValue" className="w-24">Initial Value:</label>
            <Input
              id="initialValue"
              type="number"
              value={initialValue}
              onChange={handleInitialValueChange}
              className="w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="stepSize" className="w-24">Step Size:</label>
            <Input
              id="stepSize"
              type="number"
              value={stepSize}
              onChange={handleStepSizeChange}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

