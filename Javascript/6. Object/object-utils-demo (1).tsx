"use client"

import React, { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Utility functions
const mapKeys = (obj: Record<string, any>, fn: (value: any, key: string, obj: Record<string, any>) => string) =>
  Object.keys(obj).reduce(
    (acc, k) => {
      acc[fn(obj[k], k, obj)] = obj[k]
      return acc
    },
    {} as Record<string, any>,
  )

const deepMapKeys = (obj: any, fn: (key: string) => string): any =>
  Array.isArray(obj)
    ? obj.map((val) => deepMapKeys(val, fn))
    : typeof obj === "object"
      ? Object.keys(obj).reduce(
          (acc, current) => {
            const key = fn(current)
            const val = obj[current]
            acc[key] = val !== null && typeof val === "object" ? deepMapKeys(val, fn) : val
            return acc
          },
          {} as Record<string, any>,
        )
      : obj

const renameKeys = (keysMap: Record<string, string>, obj: Record<string, any>) =>
  Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || key]: obj[key] },
    }),
    {} as Record<string, any>,
  )

const symbolizeKeys = (obj: Record<string, any>) =>
  Object.keys(obj).reduce((acc, key) => ({ ...acc, [Symbol(key)]: obj[key] }), {} as Record<symbol, any>)

const transform = (
  obj: Record<string, any>,
  fn: (acc: any, value: any, key: string, obj: Record<string, any>) => any,
  acc: any,
) => Object.keys(obj).reduce((a, k) => fn(a, obj[k], k, obj), acc)

export default function ObjectUtilsDemo() {
  const [inputObj, setInputObj] = useState('{"a": 1, "b": 2, "c": 3}')
  const [functionType, setFunctionType] = useState("mapKeys")
  const [additionalInput, setAdditionalInput] = useState("")
  const [result, setResult] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleExecute = () => {
    try {
      const obj = JSON.parse(inputObj)
      let res: any

      switch (functionType) {
        case "mapKeys":
          res = mapKeys(obj, (_, k) => k.toUpperCase())
          break
        case "deepMapKeys":
          res = deepMapKeys(obj, (k) => k.toUpperCase())
          break
        case "renameKeys":
          const keysMap = JSON.parse(additionalInput)
          res = renameKeys(keysMap, obj)
          break
        case "symbolizeKeys":
          res = symbolizeKeys(obj)
          break
        case "transform":
          res = transform(
            obj,
            (acc, val, key) => {
              ;(acc[val] || (acc[val] = [])).push(key)
              return acc
            },
            {},
          )
          break
      }

      setResult(JSON.stringify(res, (_, v) => (typeof v === "symbol" ? v.toString() : v), 2))
      setError(null)
    } catch (err) {
      setError("Invalid input. Please check your JSON and try again.")
      setResult("")
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Object Utility Functions Demo</CardTitle>
        <CardDescription>Test various object manipulation functions</CardDescription>
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
            <label className="block mb-2 text-sm font-medium">Select Function:</label>
            <Select value={functionType} onValueChange={setFunctionType}>
              <SelectTrigger>
                <SelectValue placeholder="Select a function" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mapKeys">mapKeys</SelectItem>
                <SelectItem value="deepMapKeys">deepMapKeys</SelectItem>
                <SelectItem value="renameKeys">renameKeys</SelectItem>
                <SelectItem value="symbolizeKeys">symbolizeKeys</SelectItem>
                <SelectItem value="transform">transform</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {functionType === "renameKeys" && (
            <div>
              <label className="block mb-2 text-sm font-medium">Keys Map:</label>
              <Input
                type="text"
                value={additionalInput}
                onChange={(e) => setAdditionalInput(e.target.value)}
                placeholder='{"oldKey": "newKey"}'
              />
            </div>
          )}
          <Button onClick={handleExecute}>Execute</Button>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {result && (
            <div>
              <label className="block mb-2 text-sm font-medium">Result:</label>
              <pre className="bg-gray-100 p-2 rounded overflow-x-auto">{result}</pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

