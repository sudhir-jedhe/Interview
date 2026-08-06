'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Cookies from 'js-cookie'

export default function CookieDemo() {
  const [cookieName, setCookieName] = useState('')
  const [cookieValue, setCookieValue] = useState('')
  const [expiration, setExpiration] = useState('')
  const [cookies, setCookies] = useState<{[key: string]: string}>({})

  useEffect(() => {
    updateCookieList()
  }, [])

  const updateCookieList = () => {
    setCookies(Cookies.get())
  }

  const setCookie = () => {
    if (cookieName && cookieValue) {
      const options: Cookies.CookieAttributes = {}
      if (expiration) {
        options.expires = Number(expiration)
      }
      Cookies.set(cookieName, cookieValue, options)
      updateCookieList()
      setCookieName('')
      setCookieValue('')
      setExpiration('')
    }
  }

  const deleteCookie = (name: string) => {
    Cookies.remove(name)
    updateCookieList()
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Cookie Demonstration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Cookie Name"
            value={cookieName}
            onChange={(e) => setCookieName(e.target.value)}
          />
          <Input
            placeholder="Cookie Value"
            value={cookieValue}
            onChange={(e) => setCookieValue(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Expiration (days)"
            value={expiration}
            onChange={(e) => setExpiration(e.target.value)}
          />
          <Button onClick={setCookie}>Set Cookie</Button>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Current Cookies:</h3>
          {Object.entries(cookies).map(([name, value]) => (
            <div key={name} className="flex justify-between items-center mb-2">
              <span>{name}: {value}</span>
              <Button variant="destructive" onClick={() => deleteCookie(name)}>Delete</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

