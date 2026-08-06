import React, { useState } from 'react'
import { Button } from "@/components/ui/button"

export default function PracticalExamples() {
  const [result, setResult] = useState('')

  const fetchData = async (url: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return `Data from ${url}`
  }

  const handleSimplePromise = async () => {
    try {
      const data = await fetchData('https://api.example.com/data')
      setResult(`Simple Promise: ${data}`)
    } catch (err) {
      setResult(`Error: ${err}`)
    }
  }

  const handleMultipleRequests = async () => {
    try {
      const [data1, data2] = await Promise.all([
        fetchData('https://api.example.com/data1'),
        fetchData('https://api.example.com/data2')
      ])
      setResult(`Multiple Requests: ${data1}, ${data2}`)
    } catch (err) {
      setResult(`Error: ${err}`)
    }
  }

  const fetchWithTimeout = async (url: string, timeout: number) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(id)
      return response
    } catch (err) {
      clearTimeout(id)
      throw err
    }
  }

  const handleFetchWithTimeout = async () => {
    try {
      await fetchWithTimeout('https://api.example.com/data', 2000)
      setResult('Fetch with timeout: Success')
    } catch (err) {
      setResult(`Fetch with timeout: ${err}`)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Practical Examples</h2>
      <div className="space-x-2">
        <Button onClick={handleSimplePromise}>Simple Promise</Button>
        <Button onClick={handleMultipleRequests}>Multiple Requests</Button>
        <Button onClick={handleFetchWithTimeout}>Fetch with Timeout</Button>
      </div>
      {result && <div className="mt-2">{result}</div>}
    </div>
  )
}

