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

import { type TreeModel, type TreeContext } from '@siemens/ix';
import { IxTree, IxIcon } from '@siemens/ix-react';
import { iconFolderFilled } from '@siemens/ix-icons/icons';
import { useMemo, useState } from 'react';

import { useWorkflowStore } from '../../store/useWorkflowStore';
import { TC_ACTION_REGISTRY } from '../../constants';

type TreeData = {
  type: 'action' | undefined;
  name: string;
};

export function TaskHandlerHierarchy(taskNodeId: string) {
  const [context, setContext] = useState<TreeContext>({});

  const activeWorkflowId = useWorkflowStore((state) => state.activeWorkflowId);
  const workflow = useWorkflowStore((state) => state.workflows[activeWorkflowId]);
  const taskNode = workflow.nodes.find((n) => n.id === taskNodeId);

  const taskHandlerHierarchy = useMemo(() => {
    const model: TreeModel<TreeData> = {
      root: {
        id: 'root',
        data: { type: undefined, name: '' },
        hasChildren: false,
        children: [],
      },
    };

    if (!taskNode) return model;

    taskNode.data.actions.forEach((action) => {
      model[action.id] = {
        id: action.id,
        data: {
          type: 'action',
          name: TC_ACTION_REGISTRY[action.actionType],
        },
        hasChildren: true,
        children: [],
      };

      action.handlers.forEach((handler) => {
        model[handler.id] = {
          id: handler.id,
          data: {
            type: undefined,
            name: handler.name,
          },
          hasChildren: false,
          children: [],
        };

        model[action.id].children.push(handler.id);
      });
    });

    return model;
  }, [taskNode]);

  return (
    <IxTree
      root={'root'}
      model={taskHandlerHierarchy}
      context={context}
      onContextChange={({ detail }) => {
        setContext(detail);
      }}
      renderItem={(data: TreeData) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {data.type === 'action' && (
            <IxIcon
              name={iconFolderFilled}
              size="16"
              style={{
                marginInlineEnd: '0.5rem',
              }}
            />
          )}
          {data.name}
        </div>
      )}
    ></IxTree>
  );
}
