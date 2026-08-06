'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ThisKeywordDemo() {
  const [globalThis, setGlobalThis] = useState('')
  const [methodThis, setMethodThis] = useState('')
  const [constructorThis, setConstructorThis] = useState('')
  const [arrowThis, setArrowThis] = useState('')
  const [bindThis, setBindThis] = useState('')

  // Global context
  function showGlobalThis() {
    setGlobalThis(JSON.stringify(this))
  }

  // Object method
  const person = {
    name: 'Alice',
    greet: function() {
      setMethodThis(JSON.stringify(this))
    }
  }

  // Constructor function
  function Person(name: string) {
    this.name = name
    setConstructorThis(JSON.stringify(this))
  }

  // Arrow function
  const obj = {
    name: 'Bob',
    greet: () => {
      setArrowThis(JSON.stringify(this))
    }
  }

  // Bind example
  function greet(this: { name: string }) {
    setBindThis(JSON.stringify(this))
  }
  const boundGreet = greet.bind({ name: 'Charlie' })

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>JavaScript 'this' Keyword Demonstration</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="global">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="method">Method</TabsTrigger>
            <TabsTrigger value="constructor">Constructor</TabsTrigger>
            <TabsTrigger value="arrow">Arrow</TabsTrigger>
            <TabsTrigger value="bind">Bind</TabsTrigger>
          </TabsList>
          <TabsContent value="global">
            <Button onClick={showGlobalThis}>Show Global This</Button>
            <pre className="mt-4 p-2 bg-gray-100 rounded">{globalThis || 'Click the button to see result'}</pre>
          </TabsContent>
          <TabsContent value="method">
            <Button onClick={() => person.greet()}>Show Method This</Button>
            <pre className="mt-4 p-2 bg-gray-100 rounded">{methodThis || 'Click the button to see result'}</pre>
          </TabsContent>
          <TabsContent value="constructor">
            <Button onClick={() => new Person('Alice')}>Show Constructor This</Button>
            <pre className="mt-4 p-2 bg-gray-100 rounded">{constructorThis || 'Click the button to see result'}</pre>
          </TabsContent>
          <TabsContent value="arrow">
            <Button onClick={() => obj.greet()}>Show Arrow Function This</Button>
            <pre className="mt-4 p-2 bg-gray-100 rounded">{arrowThis || 'Click the button to see result'}</pre>
          </TabsContent>
          <TabsContent value="bind">
            <Button onClick={boundGreet}>Show Bound This</Button>
            <pre className="mt-4 p-2 bg-gray-100 rounded">{bindThis || 'Click the button to see result'}</pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

