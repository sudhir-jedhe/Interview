import React, { useState } from 'react'
import { Button } from "@/components/ui/button"

export default function HandlingPromises() {
  const [result, setResult] = useState('')

  const createPromise = (shouldResolve: boolean) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldResolve) {
          resolve("Data")
        } else {
          reject("Error!")
        }
      }, 1000)
    })
  }

  const handleThen = () => {
    createPromise(true)
      .then(value => setResult(`Then: ${value}`))
      .catch(error => setResult(`Catch: ${error}`))
  }

  const handleCatch = () => {
    createPromise(false)
      .then(value => setResult(`Then: ${value}`))
      .catch(error => setResult(`Catch: ${error}`))
  }

  const handleFinally = () => {
    createPromise(true)
      .finally(() => setResult("Finally: Execution complete"))
      .then(value => setResult(prev => `${prev}, Then: ${value}`))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Handling Promises</h2>
      <div className="space-x-2">
        <Button onClick={handleThen}>Then</Button>
        <Button onClick={handleCatch}>Catch</Button>
        <Button onClick={handleFinally}>Finally</Button>
      </div>
      {result && <div className="mt-2">{result}</div>}
    </div>
  )
}

