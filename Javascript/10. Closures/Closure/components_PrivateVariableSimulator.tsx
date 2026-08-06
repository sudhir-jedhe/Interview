'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function PrivateVariableSimulator() {
  const [person, setPerson] = useState(() => {
    let _name = 'John Doe'
    let _age = 30

    return {
      getName: () => _name,
      getAge: () => _age,
      setAge: (newAge: number) => {
        _age = newAge
      },
    }
  })

  const [newAge, setNewAge] = useState('')

  const handleSetAge = () => {
    const age = parseInt(newAge)
    if (!isNaN(age)) {
      person.setAge(age)
      setPerson({ ...person })
      setNewAge('')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Private Variable Simulator</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2">Name: {person.getName()}</p>
        <p className="mb-4">Age: {person.getAge()}</p>
        <div className="flex space-x-2">
          <Input
            type="number"
            value={newAge}
            onChange={(e) => setNewAge(e.target.value)}
            placeholder="Enter new age"
          />
          <Button onClick={handleSetAge}>Set Age</Button>
        </div>
      </CardContent>
    </Card>
  )
}

