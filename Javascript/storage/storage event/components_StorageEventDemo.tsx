import React from 'react'
import LocalStorageManipulator from './LocalStorageManipulator'
import StorageEventListener from './StorageEventListener'

export default function StorageEventDemo() {
  return (
    <div className="space-y-4">
      <LocalStorageManipulator />
      <StorageEventListener />
    </div>
  )
}

