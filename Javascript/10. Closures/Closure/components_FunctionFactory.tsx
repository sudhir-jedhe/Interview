'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function FunctionFactory() {
  const [factor, setFactor] = useState('')
  const [number, setNumber] = useState('')
  const [result, setResult] = useState<number | null>(null)

  const createMultiplier = (factor: number) => {
    // This is a closure that "remembers" the factor
    return (x: number) => x * factor
  }

  const handleMultiply = () => {
    const factorNum = parseFloat(factor)
    const numberNum = parseFloat(number)
    if (!isNaN(factorNum) && !isNaN(numberNum)) {
      const multiplier = createMultiplier(factorNum)
      setResult(multiplier(numberNum))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Function Factory (Multiplier)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Input
            type="number"
            value={factor}
            onChange={(e) => setFactor(e.target.value)}
            placeholder="Enter factor"
          />
          <Input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter number to multiply"
          />
          <Button onClick={handleMultiply}>Multiply</Button>
          {result !== null && (
            <p className="mt-4">Result: {result}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

