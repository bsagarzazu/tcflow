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

import { type TreeModel } from '@siemens/ix';
import { useMemo } from 'react';

import { useWorkflowStore } from '../store/useWorkflowStore';
import { TASK_ICON_MAP } from '../constants';
import { type TreeData } from '../types';

export function useBuildWorkflowHierarchy() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);

  const workflowHierarchy = useMemo(() => {
    const model: TreeModel<TreeData> = {
      root: {
        id: 'root',
        data: { name: '', type: '', icon: '' },
        hasChildren: false,
        children: [],
      },
    };

    nodes.forEach((node) => {
      if (node.data.type === 'Start' || node.data.type === 'End') {
        return;
      }

      model[node.id] = {
        id: node.id,
        data: {
          name: node.data.name as string,
          type: node.data.type as string,
          icon: TASK_ICON_MAP[node.data.type as string],
        },
        hasChildren: false,
        children: [],
      };
    });

    const childrenNodes = new Set(edges.map((edge) => edge.target));

    edges.forEach((edge) => {
      const parentNode = model[edge.source];
      const childNode = model[edge.target];

      if (parentNode && childNode) {
        parentNode.children.push(edge.target);
        parentNode.hasChildren = true;
      }
    });

    nodes.forEach((node) => {
      if (node.data.type === 'Start' || node.data.type === 'End') {
        return;
      }

      if (!childrenNodes.has(node.id)) {
        model.root.children.push(node.id);
        model.root.hasChildren = true;
      }
    });

    return model;
  }, [nodes, edges]);

  return workflowHierarchy;
}
