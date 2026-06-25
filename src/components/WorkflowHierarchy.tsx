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

import { useState, useCallback } from 'react';
import { type TreeContext } from '@siemens/ix';
import { IxPane, IxTree, IxIcon, showModal } from '@siemens/ix-react';
import { useReactFlow } from '@xyflow/react';

import { useBuildWorkflowHierarchy } from '../hooks/useWorkflowHierarchy';
import { type TreeData, type TaskNodeType } from '../types';
import { TaskProperties } from './TaskProperties';

export function WorkflowHierarchy() {
  const { getNode } = useReactFlow();
  const [context, setContext] = useState<TreeContext>({});
  const treeModel = useBuildWorkflowHierarchy();

  const onNodeClick = useCallback(
    async (event: any) => {
      const node = getNode(event.detail);
      if (node) {
        await showModal({
          content: <TaskProperties node={node as TaskNodeType} />,
        });
      }
    },
    [getNode, showModal],
  );

  return (
    <IxPane composition="right" variant="floating">
      <IxTree
        root="root"
        model={treeModel}
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
            <IxIcon
              name={data.icon}
              size="16"
              style={{
                marginInlineEnd: '0.5rem',
              }}
            />
            {data.name}
          </div>
        )}
        onNodeClicked={onNodeClick}
      ></IxTree>
    </IxPane>
  );
}
