'use client'

import React, { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { objectLocalStorage, classLocalStorage } from '../utils/customLocalStorage'

type LocalStorageType = typeof objectLocalStorage | typeof classLocalStorage;

const LocalStorageInteraction: React.FC<{ storage: LocalStorageType }> = ({ storage }) => {
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')
  const [getKey, setGetKey] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const updateDisplay = useCallback(() => {
    setResult(JSON.stringify(storage.storage || {}, null, 2))
  }, [storage])

  const handleSet = useCallback(() => {
    try {
      storage.setItem(key, value)
      setKey('')
      setValue('')
      setError(null)
      updateDisplay()
    } catch (err) {
      setError((err as Error).message)
    }
  }, [storage, key, value, updateDisplay])

  const handleGet = useCallback(() => {
    try {
      const item = storage.getItem(getKey)
      setResult(item !== null ? item : 'Item not found')
      setError(null)
    } catch (err) {
      setError((err as Error).message)
    }
  }, [storage, getKey])

  const handleRemove = useCallback(() => {
    storage.removeItem(getKey)
    setGetKey('')
    setError(null)
    updateDisplay()
  }, [storage, getKey, updateDisplay])

  const handleClear = useCallback(() => {
    storage.clear()
    setError(null)
    updateDisplay()
  }, [storage, updateDisplay])

  return (
    <div className="space-y-4">
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
        <Button onClick={handleSet}>Set</Button>
      </div>
      <div className="flex space-x-2">
        <Input
          placeholder="Key"
          value={getKey}
          onChange={(e) => setGetKey(e.target.value)}
        />
        <Button onClick={handleGet}>Get</Button>
        <Button onClick={handleRemove} variant="destructive">Remove</Button>
      </div>
      <Button onClick={handleClear} variant="outline">Clear All</Button>
      {error && <div className="text-red-500">{error}</div>}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Storage Contents:</h3>
        <pre className="bg-gray-100 p-2 rounded">{result || 'Empty'}</pre>
      </div>
    </div>
  )
}

export default function LocalStorageDemo() {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Custom localStorage Demonstration</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="object">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="object">Object-based</TabsTrigger>
            <TabsTrigger value="class">Class-based</TabsTrigger>
          </TabsList>
          <TabsContent value="object">
            <LocalStorageInteraction storage={objectLocalStorage} />
          </TabsContent>
          <TabsContent value="class">
            <LocalStorageInteraction storage={classLocalStorage} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

