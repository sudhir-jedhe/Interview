import React, { useState } from 'react'
import { Button } from "@/components/ui/button"

export default function CombiningPromises() {
  const [result, setResult] = useState('')

  const createPromise = (value: string, delay: number) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(value), delay)
    })
  }

  const handleAll = () => {
    Promise.all([
      createPromise("One", 1000),
      createPromise("Two", 2000),
      createPromise("Three", 3000)
    ])
      .then(values => setResult(`All: ${values.join(', ')}`))
  }

  const handleRace = () => {
    Promise.race([
      createPromise("One", 1000),
      createPromise("Two", 2000),
      createPromise("Three", 3000)
    ])
      .then(value => setResult(`Race: ${value}`))
  }

  const handleAllSettled = () => {
    Promise.allSettled([
      createPromise("One", 1000),
      Promise.reject("Error"),
      createPromise("Three", 3000)
    ])
      .then(results => setResult(`AllSettled: ${JSON.stringify(results)}`))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Combining Promises</h2>
      <div className="space-x-2">
        <Button onClick={handleAll}>Promise.all</Button>
        <Button onClick={handleRace}>Promise.race</Button>
        <Button onClick={handleAllSettled}>Promise.allSettled</Button>
      </div>
      {result && <div className="mt-2">{result}</div>}
    </div>
  )
}

