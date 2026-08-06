'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PromiseBasics from './PromiseBasics'
import HandlingPromises from './HandlingPromises'
import CombiningPromises from './CombiningPromises'
import AsyncAwait from './AsyncAwait'
import PracticalExamples from './PracticalExamples'

export default function AsyncJSCheatsheet() {
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Asynchronous JavaScript Cheatsheet</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basics">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basics">Promise Basics</TabsTrigger>
            <TabsTrigger value="handling">Handling Promises</TabsTrigger>
            <TabsTrigger value="combining">Combining Promises</TabsTrigger>
            <TabsTrigger value="asyncawait">Async/Await</TabsTrigger>
            <TabsTrigger value="examples">Practical Examples</TabsTrigger>
          </TabsList>
          <TabsContent value="basics">
            <PromiseBasics />
          </TabsContent>
          <TabsContent value="handling">
            <HandlingPromises />
          </TabsContent>
          <TabsContent value="combining">
            <CombiningPromises />
          </TabsContent>
          <TabsContent value="asyncawait">
            <AsyncAwait />
          </TabsContent>
          <TabsContent value="examples">
            <PracticalExamples />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

