'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SessionStorageDemo() {
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')
  const [getKey, setGetKey] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [storageContents, setStorageContents] = useState<string>('')

  const updateStorageDisplay = useCallback(() => {
    const contents: Record<string, string> = {}
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key) {
        contents[key] = sessionStorage.getItem(key) || ''
      }
    }
    setStorageContents(JSON.stringify(contents, null, 2))
  }, [])

  useEffect(() => {
    updateStorageDisplay()
  }, [updateStorageDisplay])

  const handleSet = useCallback(() => {
    if (key && value) {
      sessionStorage.setItem(key, value)
      setKey('')
      setValue('')
      updateStorageDisplay()
    }
  }, [key, value, updateStorageDisplay])

  const handleGet = useCallback(() => {
    if (getKey) {
      const item = sessionStorage.getItem(getKey)
      setResult(item !== null ? item : 'Item not found')
    }
  }, [getKey])

  const handleRemove = useCallback(() => {
    if (getKey) {
      sessionStorage.removeItem(getKey)
      setGetKey('')
      setResult(null)
      updateStorageDisplay()
    }
  }, [getKey, updateStorageDisplay])

  const handleClear = useCallback(() => {
    sessionStorage.clear()
    setResult(null)
    updateStorageDisplay()
  }, [updateStorageDisplay])

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>sessionStorage Demonstration</CardTitle>
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
          <Button onClick={handleSet}>Set Item</Button>
        </div>
        <div className="flex space-x-2">
          <Input
            placeholder="Key"
            value={getKey}
            onChange={(e) => setGetKey(e.target.value)}
          />
          <Button onClick={handleGet}>Get Item</Button>
          <Button onClick={handleRemove} variant="destructive">Remove Item</Button>
        </div>
        <Button onClick={handleClear} variant="outline">Clear All</Button>
        {result !== null && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Result:</h3>
            <pre className="bg-gray-100 p-2 rounded">{result}</pre>
          </div>
        )}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">sessionStorage Contents:</h3>
          <pre className="bg-gray-100 p-2 rounded">{storageContents || 'Empty'}</pre>
        </div>
      </CardContent>
    </Card>
  )
}

