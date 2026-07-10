/*
 * TcFlow - Web-based Teamcenter workflow editor.
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

import { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  useReactFlow,
  Background,
  Controls,
  type Node,
  useNodesInitialized,
  type Edge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { showModal } from '@siemens/ix-react';

import { WorkflowUndoRedo } from './WorkflowUndoRedo';
import { WorkflowContextMenu } from './WorkflowContextMenu';

import { useAppStore } from '../../store/useAppStore';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { type TaskNodeType } from '../../types';
import { generateId } from '../../core/utils';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { AppWatermark, AppFooterNotice } from '../app';
import { TaskNode, TaskProperties } from '../task';

const nodeTypes = {
  task: TaskNode,
};

interface MenuState {
  id: string;
  type: 'node' | 'edge' | 'pane';
  top: number;
  left: number;
}

export function WorkflowCanvas() {
  const theme = useAppStore((state) => state.theme);
  const { pause, resume } = useWorkflowStore.temporal.getState();

  const activeWorkflowId = useWorkflowStore((state) => state.activeWorkflowId);
  const nodes = useWorkflowStore((state) => state.workflows[activeWorkflowId].nodes);
  const edges = useWorkflowStore((state) => state.workflows[activeWorkflowId].edges);
  const onNodesChange = useWorkflowStore((state) => state.onNodesChange);
  const onEdgesChange = useWorkflowStore((state) => state.onEdgesChange);
  const onViewportChange = useWorkflowStore((state) => state.onViewportChange);
  const onConnect = useWorkflowStore((state) => state.onConnect);
  const setNodes = useWorkflowStore((state) => state.setNodes);

  const nodesInitialized = useNodesInitialized();
  const { screenToFlowPosition, fitView, setViewport } = useReactFlow();
  const [menu, setMenu] = useState<MenuState | null>(null);

  useKeyboardShortcuts();

  useEffect(() => {
    if (!nodesInitialized) return;

    const viewport = useWorkflowStore.getState().workflows[activeWorkflowId].viewport;

    if (viewport && (viewport.x !== 0 || viewport.y !== 0)) {
      setViewport(viewport, { duration: 500 });
    } else {
      fitView({ padding: 0.2, duration: 500 });
    }
  }, [activeWorkflowId, nodesInitialized, fitView, setViewport]);

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
      setNodes(nodes.concat(newTask as TaskNodeType));
    },
    [screenToFlowPosition, nodes, setNodes],
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

  const onNodeDoubleClick = useCallback(
    async (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      await showModal({
        content: <TaskProperties node={node as TaskNodeType} />,
      });
    },
    [showModal],
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onViewportChange={onViewportChange}
        onNodeDragStart={() => pause()}
        onNodeDragStop={() => resume()}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        onPaneClick={onPaneClick}
        onNodeDoubleClick={onNodeDoubleClick}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
        }}
        minZoom={0.8}
        maxZoom={1.2}
        colorMode={theme}
      >
        <Background />
        <Controls position="top-left" />
        <WorkflowUndoRedo position="bottom-left" />
        {menu && <WorkflowContextMenu onClick={onPaneClick} {...menu} />}
        <AppWatermark />
        <AppFooterNotice />
      </ReactFlow>
    </div>
  );
}
