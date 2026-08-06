import TokenBucketDemo from '@/components/TokenBucketDemo'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Token Bucket Rate Limiter Demonstration</h1>
      <TokenBucketDemo />
    </main>
  )
}

