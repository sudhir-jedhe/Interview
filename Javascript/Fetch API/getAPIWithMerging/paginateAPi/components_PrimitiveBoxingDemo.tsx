'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrimitiveBoxingDemo() {
  const [inputString, setInputString] = useState('')
  const [inputNumber, setInputNumber] = useState('')
  const [stringResult, setStringResult] = useState('')
  const [numberResult, setNumberResult] = useState('')

  const demonstrateStringBoxing = () => {
    // Boxing occurs when we access the length property
    const length = inputString.length
    setStringResult(`The length of "${inputString}" is ${length}`)

    // We can also demonstrate method calls on primitives
    const upperCased = inputString.toUpperCase()
    setStringResult(prev => `${prev}\nUppercased: ${upperCased}`)
  }

  const demonstrateNumberBoxing = () => {
    const num = parseFloat(inputNumber)
    if (isNaN(num)) {
      setNumberResult('Please enter a valid number')
      return
    }

    // Boxing occurs when we call methods on the number
    const fixed = num.toFixed(2)
    setNumberResult(`${num} fixed to 2 decimal places: ${fixed}`)

    // Another example of boxing with the toString method
    const binary = num.toString(2)
    setNumberResult(prev => `${prev}\n${num} in binary: ${binary}`)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Primitive Boxing Demonstration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">String Boxing</h3>
          <Input
            type="text"
            value={inputString}
            onChange={(e) => setInputString(e.target.value)}
            placeholder="Enter a string"
            className="mb-2"
          />
          <Button onClick={demonstrateStringBoxing}>Demonstrate String Boxing</Button>
          {stringResult && (
            <pre className="mt-2 p-2 bg-gray-100 rounded">{stringResult}</pre>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Number Boxing</h3>
          <Input
            type="number"
            value={inputNumber}
            onChange={(e) => setInputNumber(e.target.value)}
            placeholder="Enter a number"
            className="mb-2"
          />
          <Button onClick={demonstrateNumberBoxing}>Demonstrate Number Boxing</Button>
          {numberResult && (
            <pre className="mt-2 p-2 bg-gray-100 rounded">{numberResult}</pre>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

