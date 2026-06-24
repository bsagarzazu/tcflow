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

import { useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';

import { generateId } from '../core/utils';
import { serializeNode } from '../core/serializer';

export function useContextMenuActions(id: string) {
  const { getNode, setNodes, addNodes, setEdges, screenToFlowPosition } = useReactFlow();

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

        addNodes({
          ...nodeData.payload,
          id: generateId(),
          position,
          selected: true,
        });
      });
    },
    [addNodes, screenToFlowPosition],
  );

  const duplicateTaskNode = useCallback(() => {
    const node = getNode(id);
    if (!node) return;
    const position = { x: node.position.x + 50, y: node.position.y + 50 };

    addNodes({
      ...node,
      selected: false,
      dragging: false,
      id: generateId(),
      position,
    });
  }, [id, getNode, addNodes]);

  const deleteTaskNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
  }, [id, setNodes, setEdges]);

  const cutTaskNode = useCallback(() => {
    copyTaskNode();
    deleteTaskNode();
  }, [id, copyTaskNode, deleteTaskNode]);

  const deleteEdge = useCallback(() => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  }, [id, setEdges]);

  return {
    cutTaskNode,
    copyTaskNode,
    pasteTaskNode,
    duplicateTaskNode,
    deleteTaskNode,
    deleteEdge,
  };
}
