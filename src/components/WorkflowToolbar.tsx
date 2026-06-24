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
  iconArrowDownRight,
  iconRhombFilled,
  iconFlare,
  iconConnections,
  iconEye,
  iconUserManagement,
  iconCheck,
  iconTasksAll,
  iconFlag,
} from '@siemens/ix-icons/icons';
import { IxIconButton } from '@siemens/ix-react';
import { type DragEvent } from 'react';

const toolbar_buttons = [
  { icon: iconArrowDownRight, nodeType: 'Acknowledge' },
  { icon: iconRhombFilled, nodeType: 'Condition' },
  { icon: iconFlare, nodeType: 'Do' },
  { icon: iconConnections, nodeType: 'Or' },
  { icon: iconEye, nodeType: 'Review' },
  { icon: iconUserManagement, nodeType: 'Route' },
  { icon: iconCheck, nodeType: 'Validate' },
  { icon: iconTasksAll, nodeType: 'Task' },
  { icon: iconFlag, nodeType: 'AddStatus' },
];

export function WorkflowToolbar() {
  const onDragStart = (event: DragEvent, taskType: string) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/tcflow', taskType);
      event.dataTransfer.effectAllowed = 'move';
    }
  };

  return (
    <div slot="secondary">
      {toolbar_buttons.map((button, index) => (
        <IxIconButton
          key={index}
          draggable
          onDragStart={(event) => onDragStart(event, button.nodeType)}
          variant="tertiary"
          icon={button.icon}
        ></IxIconButton>
      ))}
    </div>
  );
}
