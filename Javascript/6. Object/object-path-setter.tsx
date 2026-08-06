"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

function set(object: any, path: string | string[], value: any): any {
  if (!object || typeof object !== "object" || path === "") return object

  let paths: string[]

  if (!Array.isArray(path)) {
    path = path.trim()
    path = path.replaceAll("[", ".")
    path = path.replaceAll("]", ".")
    paths = path.split(".").filter((part) => part !== "")
  } else {
    paths = path
  }

  let obj = object

  paths.forEach((path, index) => {
    if (!obj[path]) {
      if (Number.parseInt(paths[index + 1]) >= 0) {
        obj[path] = []
      } else {
        obj[path] = {}
      }
    }
    if (index === paths.length - 1) {
      obj[path] = value
    }
    obj = obj[path]
  })

  return object
}

export default function ObjectPathSetter() {
  const [object, setObject] = useState<any>({})
  const [path, setPath] = useState("")
  const [value, setValue] = useState("")

  const handleSet = () => {
    const newObject = set({ ...object }, path, value)
    setObject(newObject)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Object Path Setter</CardTitle>
        <CardDescription>Set values in nested objects using a path</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="path">Path:</Label>
            <Input
              id="path"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="e.g., user.profile.name or user.items[0].title"
            />
          </div>
          <div>
            <Label htmlFor="value">Value:</Label>
            <Input id="value" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Value to set" />
          </div>
          <Button onClick={handleSet}>Set Value</Button>
          <div>
            <Label htmlFor="object">Current Object:</Label>
            <Textarea id="object" value={JSON.stringify(object, null, 2)} readOnly rows={10} className="font-mono" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

