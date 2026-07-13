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
import {
  iconFolderFilled,
  iconFolderOpenFilled,
  iconDocumentSettings,
} from '@siemens/ix-icons/icons';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { useTaskHandlerHierarchy } from '../../hooks';
import { type TreeHandlerData, type TaskNodeType } from '../../types';

export function TaskHandlerHierarchy({
  handlerId,
  setHandlerId,
}: {
  handlerId: string | null;
  setHandlerId: (handlerId: string | null) => void;
}) {
  const { watch } = useFormContext<TaskNodeType['data']>();
  const actions = watch('actions');

  const [context, setContext] = useState<TreeContext>({});
  const treeModel = useTaskHandlerHierarchy(actions);

  useEffect(() => {
    if (!handlerId) return;

    const findParentId = () => {
      for (const key in treeModel) {
        if (treeModel[key].children.includes(handlerId)) {
          return key;
        }
      }
    };

    const parentId = findParentId();

    setContext((prev) => ({
      ...prev,
      ...(parentId ? { [parentId]: { ...prev[parentId], isExpanded: true } } : {}),
      [handlerId]: { ...prev[handlerId], isSelected: true },
    }));
  }, [handlerId, treeModel, setContext]);

  return (
    <IxTree
      root={'root'}
      model={treeModel}
      context={context}
      onNodeClicked={(event) => {
        const id = event.detail;
        if (treeModel[id].data.type === 'action') return;
        setHandlerId(id);
      }}
      onContextChange={(event) => {
        setContext({ ...event.detail });
      }}
      renderItem={(data: TreeHandlerData) => {
        const isAction = data.type === 'action';
        const nodeContext = context[data.id];
        const isExpanded = nodeContext?.isExpanded;

        const iconName = isAction
          ? isExpanded
            ? iconFolderOpenFilled
            : iconFolderFilled
          : iconDocumentSettings;

        return (
          <div
            key={data.id}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <IxIcon
              name={iconName}
              size="16"
              style={{
                marginInlineEnd: '0.5rem',
              }}
            />
            {data.name}
          </div>
        );
      }}
    ></IxTree>
  );
}
