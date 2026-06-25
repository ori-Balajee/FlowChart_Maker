import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { initialNodes, initialEdges } from './constants';
import { ProcessNode, DecisionNode, StartEndNode } from './NodeTypes';

const nodeTypes = {
  process: ProcessNode,
  decision: DecisionNode,
  startEnd: StartEndNode,
};

const API_URL = 'http://localhost:5000/api/flow';

const App = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeText, setNodeText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback(
    (_, node) => {
      setSelectedNode(node);
      setNodeText(node.data.label);
    },
    [],
  );

  const onNodeUnselect = useCallback(() => {
    setSelectedNode(null);
    setNodeText('');
  }, []);

  const updateNodeText = (text) => {
    setNodeText(text);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode?.id) {
          return {
            ...node,
            data: { ...node.data, label: text },
          };
        }
        return node;
      }),
    );
  };

  const saveFlow = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      if (response.ok) {
        alert('Flow saved successfully!');
      } else {
        alert('Failed to save flow.');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Error connecting to backend.');
    } finally {
      setIsSaving(false);
    }
  };

  const loadFlow = async () => {
    try {
      const response = await fetch(`${API_URL}/load`);
      if (response.ok) {
        const data = await response.json();
        if (data.nodes && data.edges) {
          setNodes(data.nodes);
          setEdges(data.edges);
          alert('Flow loaded successfully!');
        }
      } else {
        alert('No saved flow found.');
      }
    } catch (error) {
      console.error('Load error:', error);
      alert('Error connecting to backend.');
    }
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = {
        x: event.clientX - (reactFlowWrapper.current?.getBoundingClientRect().left || 0),
        y: event.clientY - (reactFlowWrapper.current?.getBoundingClientRect().top || 0),
      };

      const newNode = {
        id: `node_${Date.now()}`,
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes],
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col gap-4 shadow-sm z-10">
        <h1 className="text-xl font-bold text-gray-800 mb-4">FlowMaster</h1>
        
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Shapes</p>
          
          <div 
            className="p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-grab hover:border-blue-400 hover:bg-blue-50 transition-colors text-center"
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow', 'process');
            }}
          >
            Process
          </div>
          
          <div 
            className="p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-grab hover:border-orange-400 hover:bg-orange-50 transition-colors text-center"
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow', 'decision');
            }}
          >
            Decision
          </div>
          
          <div 
            className="p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-grab hover:border-green-400 hover:bg-green-50 transition-colors text-center"
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow', 'startEnd');
            }}
          >
            Start/End
          </div>
        </div>

        <div className="mt-8 space-y-2">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Persistence</p>
          <button 
            onClick={saveFlow}
            disabled={isSaving}
            className={`w-full py-2 px-4 rounded text-white font-medium transition-colors ${isSaving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSaving ? 'Saving...' : 'Save Flow'}
          </button>
          <button 
            onClick={loadFlow}
            className="w-full py-2 px-4 rounded bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
          >
            Load Flow
          </button>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400 italic">
            Drag shapes onto the canvas to start building.
          </p>
        </div>
      </aside>

      {/* Main Canvas */}
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onNodeUnselect}
          nodeTypes={nodeTypes}
          snapToGrid={true}
          snapGrid={[15, 15]}
          onDragOver={onDragOver}
          onDrop={onDrop}
          fitView
        >
          <Background color="#aaa" gap={18} />
          <Controls />
          <MiniMap />
          
          <Panel position="top-right" className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-64">
            {selectedNode ? (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Edit Text</label>
                <input
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={nodeText}
                  onChange={(e) => updateNodeText(e.target.value)}
                  autoFocus
                />
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="text-xs text-blue-500 text-right hover:underline mt-1"
                >
                  Done
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">Select a node to edit its text</p>
            )}
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

export default function AppWrapper() {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}
