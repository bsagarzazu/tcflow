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

import { useCallback, useState } from 'react';
import {
  ReactFlow,
  useReactFlow,
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

import { generateId } from '../core/utils';
import { TaskNode } from './TaskNode';
import { ContextMenu } from './ContextMenu';

const nodeTypes = {
  task: TaskNode,
};

const initialNodes: Node[] = [
  {
    id: generateId(),
    type: 'task',
    position: { x: 0, y: 0 },
    data: { type: 'Start', name: 'Start' },
    deletable: false,
  },
  {
    id: generateId(),
    type: 'task',
    position: { x: 500, y: 0 },
    data: { type: 'End', name: 'End' },
    deletable: false,
  },
];

interface MenuState {
  id: string;
  type: 'node' | 'edge' | 'pane';
  top: number;
  left: number;
}

export function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [menu, setMenu] = useState<MenuState | null>(null);

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
        id: generateId(),
        type: 'task',
        position,
        data: { type: taskType, name: taskName },
        deletable: true,
      };
      setNodes((nds) => nds.concat(newTask));
    },
    [screenToFlowPosition, setNodes],
  );

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      setMenu({
        id: node.id,
        type: 'node',
        top: event.clientY,
        left: event.clientX,
      });
    },
    [setMenu],
  );

  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      setMenu({
        id: edge.id,
        type: 'edge',
        top: event.clientY,
        left: event.clientX,
      });
    },
    [setMenu],
  );

  const onPaneContextMenu = useCallback(
    (event: MouseEvent | React.MouseEvent<Element, MouseEvent>) => {
      event.preventDefault();
      setMenu({
        id: 'pane',
        type: 'pane',
        top: event.clientY,
        left: event.clientX,
      });
    },
    [setMenu],
  );

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

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
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        onPaneClick={onPaneClick}
        defaultEdgeOptions={{ markerEnd: { type: MarkerType.ArrowClosed } }}
        fitView
        colorMode="dark"
      >
        <Background />
        <Controls position="top-left" />
        {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
      </ReactFlow>
    </div>
  );
}
