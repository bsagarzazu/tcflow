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

import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';

import { serializeNode } from '../core/json-serializer';
import { generateId } from '../core/utils';
import { useWorkflowStore } from '../store/useWorkflowStore';
import type { TaskNodeType } from '../types';

export function useContextMenuActions(id: string) {
  const { getNode, screenToFlowPosition } = useReactFlow();

  const nodes = useWorkflowStore((state) => state.workflows[state.activeWorkflowId].nodes);
  const edges = useWorkflowStore((state) => state.workflows[state.activeWorkflowId].edges);
  const setNodes = useWorkflowStore((state) => state.setNodes);
  const setEdges = useWorkflowStore((state) => state.setEdges);
  const updateEdge = useWorkflowStore((state) => state.updateEdge);

  const copyTaskNode = useCallback(() => {
    const node = getNode(id);
    if (!node) return;

    const nodeData = serializeNode(node);
    navigator.clipboard.writeText(JSON.stringify(nodeData));
  }, [id, getNode]);

  const pasteTaskNode = useCallback(
    (screenPosition: { x: number; y: number }) => {
      navigator.clipboard.readText().then((text) => {
        const nodeData = JSON.parse(text);

        if (nodeData.source !== 'tcflow-clipboard') return;

        const position = screenToFlowPosition(screenPosition);

        const newNode = {
          ...nodeData.payload,
          id: generateId(),
          position,
          selected: true,
        };

        setNodes(nodes.concat(newNode));
      });
    },
    [nodes, setNodes, screenToFlowPosition],
  );

  const duplicateTaskNode = useCallback(() => {
    const node = getNode(id);
    if (!node) return;
    const position = { x: node.position.x + 50, y: node.position.y + 50 };

    const newNode = {
      ...node,
      selected: false,
      dragging: false,
      id: generateId(),
      position,
    };

    setNodes(nodes.concat(newNode as TaskNodeType));
  }, [id, getNode, nodes, setNodes]);

  const deleteTaskNode = useCallback(() => {
    setNodes(nodes.filter((node) => node.id !== id));
    setEdges(edges.filter((edge) => edge.source !== id && edge.target !== id));
  }, [id, nodes, edges, setNodes, setEdges]);

  const cutTaskNode = useCallback(() => {
    copyTaskNode();
    deleteTaskNode();
  }, [copyTaskNode, deleteTaskNode]);

  const updateEdgeType = useCallback(
    (status: 'success' | 'failure' | 'conditional', conditionValue?: 'True' | 'False') => {
      updateEdge(id, status, conditionValue);
    },
    [id, updateEdge],
  );

  const deleteEdge = useCallback(() => {
    setEdges(edges.filter((edge) => edge.id !== id));
  }, [id, edges, setEdges]);

  return {
    cutTaskNode,
    copyTaskNode,
    pasteTaskNode,
    duplicateTaskNode,
    deleteTaskNode,
    updateEdgeType,
    deleteEdge,
  };
}
