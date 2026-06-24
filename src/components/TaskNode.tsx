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

import {
  iconPlayFilled,
  iconStopFilled,
  iconArrowDownRight,
  iconRhombFilled,
  iconFlare,
  iconConnections,
  iconEye,
  iconUserManagementFilled,
  iconCheck,
  iconTasksAll,
  iconFlagFilled,
} from '@siemens/ix-icons/icons';
import { IxActionCard } from '@siemens/ix-react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';

type TaskNode = Node<{ type: string; name: string }, 'task'>;

export function TaskNode({ data }: NodeProps<TaskNode>) {
  const iconMap: Record<string, string> = {
    Start: iconPlayFilled,
    End: iconStopFilled,
    Acknowledge: iconArrowDownRight,
    Condition: iconRhombFilled,
    Do: iconFlare,
    Or: iconConnections,
    Review: iconEye,
    Route: iconUserManagementFilled,
    Task: iconTasksAll,
    Validate: iconCheck,
    AddStatus: iconFlagFilled,
  };

  const isStart = data.type === 'Start';
  const isFinish = data.type === 'End';

  return (
    <IxActionCard
      icon={iconMap[data.type]}
      heading={data.name}
      variant="filled"
      style={{ width: '200px' }}
    >
      {!isStart && <Handle type="target" position={Position.Left} />}
      {!isFinish && <Handle type="source" position={Position.Right} />}
    </IxActionCard>
  );
}
