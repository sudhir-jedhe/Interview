import React, { useState } from 'react'
import { Button } from "@/components/ui/button"

export default function AsyncAwait() {
  const [result, setResult] = useState('')

  const fetchData = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return "Data fetched"
  }

  const handleAsyncFunction = async () => {
    try {
      const data = await fetchData()
      setResult(`Async function result: ${data}`)
    } catch (err) {
      setResult(`Error: ${err}`)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Async/Await</h2>
      <Button onClick={handleAsyncFunction}>Run Async Function</Button>
      {result && <div className="mt-2">{result}</div>}
    </div>
  )
}

