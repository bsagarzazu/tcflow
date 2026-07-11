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

import { type TreeContext } from '@siemens/ix';
import { IxTree, IxIcon } from '@siemens/ix-react';
import { iconFolderFilled } from '@siemens/ix-icons/icons';
import { useState } from 'react';

import { useBuildTaskHandlerHierarchy } from '../../hooks';
import { type TreeHandlerData } from '../../types';

export function TaskHandlerHierarchy({ taskNodeId }: { taskNodeId: string }) {
  const [context, setContext] = useState<TreeContext>({});
  const treeModel = useBuildTaskHandlerHierarchy(taskNodeId);

  return (
    <IxTree
      root={'root'}
      model={treeModel}
      context={context}
      onContextChange={({ detail }) => {
        setContext(detail);
      }}
      renderItem={(data: TreeHandlerData) => (
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
