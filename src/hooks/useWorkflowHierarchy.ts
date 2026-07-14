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

import { type TreeModel } from '@siemens/ix';
import { iconWarning } from '@siemens/ix-icons/icons';
import { useMemo } from 'react';

import { useWorkflowStore } from '../store/useWorkflowStore';
import { TC_TASK_REGISTRY } from '../constants';
import { type TreeTaskData } from '../types';

export function useWorkflowHierarchy() {
  const activeWorkflowId = useWorkflowStore((state) => state.activeWorkflowId);
  const workflow = useWorkflowStore((state) => state.workflows[activeWorkflowId]);

  const workflowHierarchy = useMemo(() => {
    const { nodes } = workflow;

    const model: TreeModel<TreeTaskData> = {
      root: {
        id: 'root',
        data: { id: '' },
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
          id: node.id,
          name: node.data.name,
          type: node.data.type,
          icon: TC_TASK_REGISTRY[node.data.type]?.ixIcon || iconWarning,
        },
        hasChildren: false,
        children: [],
      };

      model.root.children.push(node.id);
      model.root.hasChildren = true;
    });

    return model;
  }, [workflow]);

  return workflowHierarchy;
}
