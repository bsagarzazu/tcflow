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

import { IxActionCard } from '@siemens/ix-react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

import { type TaskNodeType } from '../types';
import { TC_TASK_REGISTRY } from '../constants';

export function TaskNode({ data }: NodeProps<TaskNodeType>) {
  const config = TC_TASK_REGISTRY[data.type as keyof typeof TC_TASK_REGISTRY];

  const isStart = data.type === 'Start';
  const isFinish = data.type === 'End';

  return (
    <IxActionCard
      icon={config.ixIcon}
      heading={data.name}
      variant="filled"
      style={{ width: '200px' }}
    >
      {!isStart && <Handle type="target" position={Position.Left} />}
      {!isFinish && <Handle type="source" position={Position.Right} />}
    </IxActionCard>
  );
}
