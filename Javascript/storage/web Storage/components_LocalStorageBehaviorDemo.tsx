'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function LocalStorageBehaviorDemo() {
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')
  const [storedData, setStoredData] = useState<{ [key: string]: string }>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    updateStoredData()
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const updateStoredData = () => {
    const data: { [key: string]: string } = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        data[key] = localStorage.getItem(key) || ''
      }
    }
    setStoredData(data)
  }

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key) {
      setStoredData(prev => ({
        ...prev,
        [e.key!]: e.newValue || ''
      }))
    }
  }

  const setItem = () => {
    try {
      localStorage.setItem(key, value)
      updateStoredData()
      setKey('')
      setValue('')
      setError(null)
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        setError('Storage quota exceeded. Try removing some items.')
      } else {
        setError('An error occurred while setting the item.')
      }
    }
  }

  const removeItem = (key: string) => {
    localStorage.removeItem(key)
    updateStoredData()
  }

  const clearAll = () => {
    localStorage.clear()
    updateStoredData()
  }

  const generateLargeData = () => {
    const largeString = 'A'.repeat(1024 * 1024 * 6) // 6MB string
    try {
      localStorage.setItem('largeData', largeString)
      updateStoredData()
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        setError('Storage quota exceeded. The 6MB data could not be stored.')
      } else {
        setError('An error occurred while setting large data.')
      }
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>localStorage Behavior Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <Input
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button onClick={setItem}>Set Item</Button>
        </div>
        <div className="flex space-x-2">
          <Button onClick={clearAll} variant="destructive">Clear All</Button>
          <Button onClick={generateLargeData} variant="outline">Generate Large Data</Button>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div>
          <h3 className="text-lg font-semibold mb-2">Stored Data:</h3>
          {Object.entries(storedData).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center mb-2">
              <span>{key}: {value.length > 50 ? `${value.substring(0, 50)}...` : value}</span>
              <Button onClick={() => removeItem(key)} variant="destructive" size="sm">Remove</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

