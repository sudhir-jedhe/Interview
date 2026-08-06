import Counter from '@/components/Counter'
import PrivateVariableSimulator from '@/components/PrivateVariableSimulator'
import FunctionFactory from '@/components/FunctionFactory'
import AsyncClosureExample from '@/components/AsyncClosureExample'

export default function ClosureExamples() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Closure Examples in React</h1>
      <Counter />
      <PrivateVariableSimulator />
      <FunctionFactory />
      <AsyncClosureExample />
    </div>
  )
}

