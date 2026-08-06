import React, { useState } from 'react'
import { Button } from "@/components/ui/button"

export default function PromiseBasics() {
  const [result, setResult] = useState('')

  const createPromise = (shouldResolve: boolean) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldResolve) {
          resolve("Success")
        } else {
          reject("Error occurred")
        }
      }, 1000)
    })
  }

  const handleResolve = () => {
    createPromise(true)
      .then(value => setResult(`Resolved: ${value}`))
      .catch(error => setResult(`Rejected: ${error}`))
  }

  const handleReject = () => {
    createPromise(false)
      .then(value => setResult(`Resolved: ${value}`))
      .catch(error => setResult(`Rejected: ${error}`))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Promise Basics</h2>
      <div className="space-x-2">
        <Button onClick={handleResolve}>Create Resolving Promise</Button>
        <Button onClick={handleReject}>Create Rejecting Promise</Button>
      </div>
      {result && <div className="mt-2">{result}</div>}
    </div>
  )
}

