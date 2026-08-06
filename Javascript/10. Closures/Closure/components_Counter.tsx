'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Counter() {
  const [count, setCount] = useState(0)

  // This is a closure that "remembers" the count state
  const increment = () => {
    setCount(count + 1)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Counter using Closure</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Count: {count}</p>
        <Button onClick={increment}>Increment</Button>
      </CardContent>
    </Card>
  )
}

