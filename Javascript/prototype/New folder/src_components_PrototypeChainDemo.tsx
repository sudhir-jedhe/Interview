import React, { useState, useEffect } from 'react';
import { setupAnimalPrototypes } from '../utils/animalPrototypes';

interface PrototypeInfo {
  name: string;
  methods: string[];
}

const PrototypeChainDemo: React.FC = () => {
  const [prototypeChain, setPrototypeChain] = useState<PrototypeInfo[]>([]);

  useEffect(() => {
    const { Dog } = setupAnimalPrototypes();
    const dog = new (Dog as any)('Buddy');

    const chain: PrototypeInfo[] = [];
    let currentProto = Object.getPrototypeOf(dog);

    while (currentProto !== null) {
      const protoInfo: PrototypeInfo = {
        name: currentProto.constructor.name,
        methods: Object.getOwnPropertyNames(currentProto).filter(
          prop => typeof currentProto[prop] === 'function' && prop !== 'constructor'
        ),
      };
      chain.push(protoInfo);
      currentProto = Object.getPrototypeOf(currentProto);
    }

    setPrototypeChain(chain);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Prototype Chain Demonstration</h1>
      <div className="space-y-4">
        {prototypeChain.map((proto, index) => (
          <div key={index} className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{proto.name}</h2>
            <ul className="list-disc pl-5">
              {proto.methods.map((method, methodIndex) => (
                <li key={methodIndex}>{method}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Explanation:</h2>
        <p>
          This diagram shows the prototype chain of a Dog instance. Each box represents a prototype
          in the chain, starting from Dog and going up to Object. The methods listed in each box
          are the ones defined on that specific prototype.
        </p>
        <p className="mt-2">
          When a method is called on a Dog instance, JavaScript first looks for it on the Dog
          prototype. If not found, it moves up the chain to Mammal, then Animal, and finally Object,
          until it finds the method or reaches the end of the chain.
        </p>
      </div>
    </div>
  );
};

export default PrototypeChainDemo;

