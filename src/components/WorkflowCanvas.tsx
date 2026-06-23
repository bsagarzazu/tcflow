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
  Background,
  Controls,
  type Node,
  useNodesState,
  type Edge,
  useEdgesState,
  type Connection,
  addEdge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TaskNode } from './TaskNode';

const nodeTypes = {
  task: TaskNode,
};
const initialNodes: Node[] = [
  { id: 'n1', type: 'task', position: { x: 0, y: 0 }, data: { type: 'Start', name: 'Start' } },
  {
    id: 'n2',
    type: 'task',
    position: { x: 0, y: 100 },
    data: { type: 'AddStatus', name: 'Add Status' },
  },
  { id: 'n3', type: 'task', position: { x: 0, y: 200 }, data: { type: 'End', name: 'End' } },
];
const initialEdges: Edge[] = [
  { id: 'n1-n2', source: 'n1', target: 'n2' },
  { id: 'n2-n3', source: 'n2', target: 'n3' },
];

export function WorkflowCanvas() {
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        colorMode="dark"
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        defaultEdgeOptions={{ markerEnd: { type: MarkerType.ArrowClosed } }}
        fitView
      >
        <Background />
        <Controls position="top-left" />
      </ReactFlow>
    </div>
  );
}
