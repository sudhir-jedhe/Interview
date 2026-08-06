'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LocalStorageManipulator() {
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')

  const handleSet = () => {
    if (key && value) {
      localStorage.setItem(key, value)
      setKey('')
      setValue('')
    }
  }

  const handleRemove = () => {
    if (key) {
      localStorage.removeItem(key)
      setKey('')
    }
  }

  const handleClear = () => {
    localStorage.clear()
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>localStorage Manipulator</CardTitle>
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
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleSet}>Set Item</Button>
          <Button onClick={handleRemove} variant="destructive">Remove Item</Button>
          <Button onClick={handleClear} variant="outline">Clear All</Button>
        </div>
      </CardContent>
    </Card>
  )
}

