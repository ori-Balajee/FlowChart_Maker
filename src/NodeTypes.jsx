import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

export const ProcessNode = memo(({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-400 min-w-[150px] text-center">
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-blue-400" />
      <div className="font-medium">{data.label}</div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-blue-400" />
    </div>
  );
});

export const DecisionNode = memo(({ data }) => {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <div className="absolute inset-0 rotate-45 border-2 border-orange-400 bg-orange-50" />
      <div className="relative z-10 text-center px-2 font-medium text-sm">
        {data.label}
      </div>
      <Handle type="target" position={Position.Top} style={{ top: -5 }} />
      <Handle type="source" position={Position.Bottom} style={{ bottom: -5 }} />
      <Handle type="source" position={Position.Left} style={{ left: -5 }} />
      <Handle type="source" position={Position.Right} style={{ right: -5 }} />
    </div>
  );
});

export const StartEndNode = memo(({ data }) => {
  return (
    <div className="px-6 py-3 shadow-md rounded-full bg-green-50 border-2 border-green-400 min-w-[120px] text-center font-bold">
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-green-400" />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-green-400" />
    </div>
  );
});
