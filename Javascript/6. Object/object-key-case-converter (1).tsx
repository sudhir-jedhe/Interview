'use client'

import React, { useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const upperize = (obj: Record<string, any>) =>
  Object.keys(obj).reduce((acc, k) => {
    acc[k.toUpperCase()] = obj[k];
    return acc;
  }, {} as Record<string, any>);

const lowerize = (obj: Record<string, any>) =>
  Object.keys(obj).reduce((acc, k) => {
    acc[k.toLowerCase()] = obj[k];
    return acc;
  }, {} as Record<string, any>);

const modifyKeys = (obj: Record<string, any>, caseType: 'upper' | 'lower') => 
  Object.keys(obj).reduce((acc, k) => {
    const modifiedKey = caseType === 'upper' ? k.toUpperCase() : k.toLowerCase();
    acc[modifiedKey] = obj[k];
    return acc;
  }, {} as Record<string, any>);

export default function ObjectKeyCaseConverter() {
  const [inputObj, setInputObj] = useState('{"Name": "John", "Age": 22, "City": "New York"}')
  const [caseType, setCaseType] = useState<'upper' | 'lower'>('upper')
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const convertKeys = () => {
    try {
      const obj = JSON.parse(inputObj)
      let convertedObj;
      
      if (caseType === 'upper') {
        convertedObj = upperize(obj);
      } else {
        convertedObj = lowerize(obj);
      }
      
      setResult(JSON.stringify(convertedObj, null, 2))
      setError(null)
    } catch (err) {
      setError('Invalid JSON input. Please check your object and try again.')
      setResult('')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Object Key Case Converter</CardTitle>
        <CardDescription>Convert object keys to uppercase or lowercase</CardDescription>
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
          <RadioGroup value={caseType} onValueChange={(value) => setCaseType(value as 'upper' | 'lower')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="upper" id="upper" />
              <Label htmlFor="upper">Uppercase</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lower" id="lower" />
              <Label htmlFor="lower">Lowercase</Label>
            </div>
          </RadioGroup>
          <Button onClick={convertKeys}>Convert</Button>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {result && (
            <div>
              <label className="block mb-2 text-sm font-medium">Result:</label>
              <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                {result}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

