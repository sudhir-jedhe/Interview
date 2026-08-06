"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

const initialObject = {
  name: "John",
  age: 30,
  address: {
    city: "New York",
    country: "USA",
  },
}

export default function ObjectImmutabilityDemo() {
  const [object, setObject] = useState(initialObject)
  const [immutabilityType, setImmutabilityType] = useState<"none" | "seal" | "freeze">("none")
  const [propertyName, setPropertyName] = useState("")
  const [propertyValue, setPropertyValue] = useState("")
  const [message, setMessage] = useState("")

  const applyImmutability = () => {
    const newObject = JSON.parse(JSON.stringify(object))
    if (immutabilityType === "seal") {
      Object.seal(newObject)
      Object.seal(newObject.address)
    } else if (immutabilityType === "freeze") {
      Object.freeze(newObject)
      Object.freeze(newObject.address)
    }
    setObject(newObject)
    setMessage(`Object ${immutabilityType === "none" ? "reset" : immutabilityType + "ed"}`)
  }

  const modifyProperty = () => {
    try {
      const newObject = { ...object }
      if (propertyName.includes(".")) {
        const [parent, child] = propertyName.split(".")
        newObject[parent][child] = propertyValue
      } else {
        newObject[propertyName] = propertyValue
      }
      setObject(newObject)
      setMessage(`Property "${propertyName}" set to "${propertyValue}"`)
    } catch (error) {
      setMessage(`Error: Unable to modify property "${propertyName}"`)
    }
  }

  const deleteProperty = () => {
    try {
      const newObject = { ...object }
      if (propertyName.includes(".")) {
        const [parent, child] = propertyName.split(".")
        delete newObject[parent][child]
      } else {
        delete newObject[propertyName]
      }
      setObject(newObject)
      setMessage(`Property "${propertyName}" deleted`)
    } catch (error) {
      setMessage(`Error: Unable to delete property "${propertyName}"`)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Object Immutability Demo</CardTitle>
        <CardDescription>Experiment with Object.seal() and Object.freeze()</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Immutability Type:</Label>
            <RadioGroup
              value={immutabilityType}
              onValueChange={(value) => setImmutabilityType(value as "none" | "seal" | "freeze")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">None</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="seal" id="seal" />
                <Label htmlFor="seal">Seal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="freeze" id="freeze" />
                <Label htmlFor="freeze">Freeze</Label>
              </div>
            </RadioGroup>
          </div>
          <Button onClick={applyImmutability}>Apply Immutability</Button>
          <div>
            <Label htmlFor="propertyName">Property Name:</Label>
            <Input
              id="propertyName"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              placeholder="e.g., name or address.city"
            />
          </div>
          <div>
            <Label htmlFor="propertyValue">Property Value:</Label>
            <Input
              id="propertyValue"
              value={propertyValue}
              onChange={(e) => setPropertyValue(e.target.value)}
              placeholder="New value"
            />
          </div>
          <div className="flex space-x-2">
            <Button onClick={modifyProperty}>Modify Property</Button>
            <Button onClick={deleteProperty} variant="destructive">
              Delete Property
            </Button>
          </div>
          {message && <div className="bg-gray-100 p-2 rounded">{message}</div>}
          <div>
            <Label htmlFor="objectState">Current Object State:</Label>
            <Textarea
              id="objectState"
              value={JSON.stringify(object, null, 2)}
              readOnly
              rows={10}
              className="font-mono"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

