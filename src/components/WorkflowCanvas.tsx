/*
 * TCFlow - Web-based Teamcenter workflow editor.
 * Copyright (C) 2026 Beñat Sagarzazu
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { useCallback } from 'react';
import {
  ReactFlow,
  useReactFlow,
  Background,
  Controls,
  type Node,
  useNodesState,
  useEdgesState,
  type Connection,
  addEdge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TaskNode } from './TaskNode';

let id = 0;
const getId = () => `tasknode_${id++}`;

const nodeTypes = {
  task: TaskNode,
};
const initialNodes: Node[] = [
  {
    id: 'n1',
    type: 'task',
    position: { x: 0, y: 0 },
    data: { type: 'Start', name: 'Start' },
    deletable: false,
  },
  {
    id: 'n2',
    type: 'task',
    position: { x: 0, y: 100 },
    data: { type: 'End', name: 'End' },
    deletable: false,
  },
];

export function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const taskType = event.dataTransfer.getData('application/tcflow');
      if (!taskType) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const taskName = `${taskType.replace(/([A-Z])/g, ' $1').trim()} Task`;
      const newTask = {
        id: getId(),
        type: 'task',
        position,
        data: { type: taskType, name: taskName },
        deletable: true,
      };
      setNodes((nds) => nds.concat(newTask));
    },
    [screenToFlowPosition, setNodes],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        defaultEdgeOptions={{ markerEnd: { type: MarkerType.ArrowClosed } }}
        fitView
        colorMode="dark"
      >
        <Background />
        <Controls position="top-left" />
      </ReactFlow>
    </div>
  );
}
