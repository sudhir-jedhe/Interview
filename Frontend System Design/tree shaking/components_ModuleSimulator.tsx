import React from 'react'

type ExportType = {
  name: string;
  used: boolean;
}

interface ModuleSimulatorProps {
  moduleName: string;
  exports: ExportType[];
}

export function ModuleSimulator({ moduleName, exports }: ModuleSimulatorProps) {
  return (
    <div className="border rounded p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">{moduleName}</h3>
      <div className="space-y-2">
        {exports.map((exp, index) => (
          <div 
            key={index} 
            className={`p-2 rounded ${exp.used ? 'bg-green-100' : 'bg-red-100'}`}
          >
            {exp.name} {exp.used ? '(Used)' : '(Unused)'}
          </div>
        ))}
      </div>
    </div>
  )
}

