"use client"

import React, { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const sortKeys = (obj: Record<string, any>, method: string) => {
  const keys = Object.keys(obj)

  switch (method) {
    case "default":
      return keys
    case "ascending":
      return keys.sort((a, b) => a.localeCompare(b))
    case "descending":
      return keys.sort((a, b) => b.localeCompare(a))
    case "numeric":
      return keys.sort((a, b) => Number(a) - Number(b))
    default:
      return keys
  }
}

export default function ObjectKeySorter() {
  const [inputObj, setInputObj] = useState('{"e": 1, "c": 2, "b": 3, "d": 4, "a": 5}')
  const [sortMethod, setSortMethod] = useState("default")
  const [result, setResult] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSort = () => {
    try {
      const obj = JSON.parse(inputObj)
      const sortedKeys = sortKeys(obj, sortMethod)
      const sortedObj = sortedKeys.reduce((acc: Record<string, any>, key: string) => {
        acc[key] = obj[key]
        return acc
      }, {})

      setResult(JSON.stringify(sortedObj, null, 2))
      setError(null)
    } catch (err) {
      setError("Invalid JSON input. Please check your object and try again.")
      setResult("")
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Object Key Sorter</CardTitle>
        <CardDescription>Experiment with JavaScript object key sorting</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Input Object:</label>
            <Textarea
              value={inputObj}
              onChange={(e) => setInputObj(e.target.value)}
              placeholder="Enter object as JSON"
              rows={5}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Select Sorting Method:</label>
            <Select value={sortMethod} onValueChange={setSortMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select a method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default (Insertion Order)</SelectItem>
                <SelectItem value="ascending">Alphabetical Ascending</SelectItem>
                <SelectItem value="descending">Alphabetical Descending</SelectItem>
                <SelectItem value="numeric">Numeric</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSort}>Sort</Button>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {result && (
            <div>
              <label className="block mb-2 text-sm font-medium">Sorted Object:</label>
              <pre className="bg-gray-100 p-2 rounded overflow-x-auto">{result}</pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

