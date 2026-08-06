"use client"

import React, { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Flattening methods
const flattenObjForIn = (ob: Record<string, any>) => {
  const result: Record<string, any> = {}

  for (const i in ob) {
    if (typeof ob[i] === "object" && !Array.isArray(ob[i])) {
      const temp = flattenObjForIn(ob[i])
      for (const j in temp) {
        result[i + "." + j] = temp[j]
      }
    } else {
      result[i] = ob[i]
    }
  }

  return result
}

const squashObjectAssign = (inputObject: Record<string, any>, parentKey = "") => {
  const outputObject: Record<string, any> = {}

  for (const key in inputObject) {
    const newKey = parentKey ? `${parentKey}.${key}` : key

    if (typeof inputObject[key] === "object" && !Array.isArray(inputObject[key])) {
      Object.assign(outputObject, squashObjectAssign(inputObject[key], newKey))
    } else {
      outputObject[newKey] = inputObject[key]
    }
  }

  return outputObject
}

const squashObjectMap = (obj: Record<string, any>) => {
  return Object.assign(
    {},
    ...Object.keys(obj).map((k) =>
      typeof obj[k] === "object" && !Array.isArray(obj[k]) ? squashObjectMap(obj[k]) : { [k]: obj[k] },
    ),
  )
}

const squashObjectReduce = (obj: Record<string, any>) => {
  return Object.keys(obj).reduce((acc: Record<string, any>, key) => {
    const value = obj[key]
    return typeof value === "object" && !Array.isArray(value)
      ? { ...acc, ...squashObjectReduce(value) }
      : { ...acc, [key]: value }
  }, {})
}

export default function ObjectFlattener() {
  const [inputObj, setInputObj] = useState('{"a": 1, "b": {"c": 2, "d": {"e": 3}}}')
  const [method, setMethod] = useState("forIn")
  const [result, setResult] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleFlatten = () => {
    try {
      const obj = JSON.parse(inputObj)
      let flattened: Record<string, any>

      switch (method) {
        case "forIn":
          flattened = flattenObjForIn(obj)
          break
        case "objectAssign":
          flattened = squashObjectAssign(obj)
          break
        case "objectMap":
          flattened = squashObjectMap(obj)
          break
        case "reduce":
          flattened = squashObjectReduce(obj)
          break
        default:
          throw new Error("Invalid method selected")
      }

      setResult(JSON.stringify(flattened, null, 2))
      setError(null)
    } catch (err) {
      setError("Invalid JSON input. Please check your object and try again.")
      setResult("")
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Object Flattener</CardTitle>
        <CardDescription>Flatten nested objects using different methods</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Input Object:</label>
            <Textarea
              value={inputObj}
              onChange={(e) => setInputObj(e.target.value)}
              placeholder="Enter nested object as JSON"
              rows={5}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Select Flattening Method:</label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select a method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="forIn">for...in Loop with Recursion</SelectItem>
                <SelectItem value="objectAssign">Object.assign() and Recursion</SelectItem>
                <SelectItem value="objectMap">Object.keys() with map()</SelectItem>
                <SelectItem value="reduce">reduce() with Recursion</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleFlatten}>Flatten</Button>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {result && (
            <div>
              <label className="block mb-2 text-sm font-medium">Flattened Object:</label>
              <pre className="bg-gray-100 p-2 rounded overflow-x-auto">{result}</pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

