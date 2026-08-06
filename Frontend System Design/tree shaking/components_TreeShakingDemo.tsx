'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ModuleSimulator } from './ModuleSimulator'

export default function TreeShakingDemo() {
  const [isShaken, setIsShaken] = useState(false)

  const modules = [
    {
      name: 'MathUtils',
      exports: [
        { name: 'add', used: true },
        { name: 'subtract', used: true },
        { name: 'multiply', used: false },
        { name: 'divide', used: false },
      ]
    },
    {
      name: 'StringUtils',
      exports: [
        { name: 'capitalize', used: true },
        { name: 'reverse', used: false },
        { name: 'trim', used: true },
      ]
    },
    {
      name: 'DateUtils',
      exports: [
        { name: 'formatDate', used: true },
        { name: 'parseDate', used: false },
        { name: 'getDaysBetween', used: false },
      ]
    }
  ]

  const calculateBundleSize = (shaken: boolean) => {
    let size = 0
    modules.forEach(module => {
      module.exports.forEach(exp => {
        if (shaken && !exp.used) return
        size += exp.name.length
      })
    })
    return size
  }

  const originalSize = calculateBundleSize(false)
  const shakenSize = calculateBundleSize(true)

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Tree Shaking Demonstration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Tree shaking is a build optimization technique that removes unused code from your final bundle.
          This demo simulates the effect of tree shaking on a set of modules.
        </p>
        <div className="space-y-4">
          {modules.map((module, index) => (
            <ModuleSimulator 
              key={index} 
              moduleName={module.name} 
              exports={isShaken ? module.exports.filter(exp => exp.used) : module.exports} 
            />
          ))}
        </div>
        <div className="flex justify-between items-center">
          <Button onClick={() => setIsShaken(!isShaken)}>
            {isShaken ? 'Show All Exports' : 'Shake the Tree'}
          </Button>
          <div>
            Bundle size: {isShaken ? shakenSize : originalSize} units
            {isShaken && (
              <span className="ml-2 text-green-600">
                ({Math.round((originalSize - shakenSize) / originalSize * 100)}% reduction)
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

