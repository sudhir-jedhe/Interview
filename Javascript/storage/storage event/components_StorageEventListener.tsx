'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StorageEventListener() {
  const [events, setEvents] = useState<string[]>([])

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      const message = `The ${e.key} key has been changed from ${e.oldValue} to ${e.newValue}.`
      setEvents(prevEvents => [message, ...prevEvents.slice(0, 9)])
    }

    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Storage Event Listener</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-y-auto border border-gray-200 rounded p-2">
          {events.map((event, index) => (
            <p key={index} className="text-sm mb-2">
              {event}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

