import StorageEventDemo from '@/components/StorageEventDemo'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Storage Event Demonstration</h1>
      <p className="mb-4">Open this page in two different windows or tabs to see the storage event in action.</p>
      <StorageEventDemo />
    </main>
  )
}

