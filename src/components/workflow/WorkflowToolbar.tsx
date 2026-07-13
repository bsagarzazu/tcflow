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

import { IxIconButton, IxTooltip } from '@siemens/ix-react';
import { type DragEvent, Fragment } from 'react';

import { TC_TASK_REGISTRY } from '../../constants';
import { type TCTaskType } from '../../types';

export function WorkflowToolbar() {
  const onDragStart = (event: DragEvent, taskType: string) => {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/tcflow', taskType);
      event.dataTransfer.effectAllowed = 'move';
    }
  };

  const toolbarButtons = (Object.keys(TC_TASK_REGISTRY) as TCTaskType[]).filter(
    (type) => type !== 'Start' && type !== 'End',
  );

  return (
    <div slot="secondary">
      {toolbarButtons.map((type) => (
        <Fragment key={type}>
          <IxIconButton
            id={`trigger-${type}`}
            draggable
            onDragStart={(event) => onDragStart(event, type)}
            variant="subtle-tertiary"
            icon={TC_TASK_REGISTRY[type].ixIcon}
            aria-describedby={`tooltip-${type}`}
            data-umami-event="create"
            data-umami-event-object="task"
            data-umami-event-type={type}
          ></IxIconButton>
          <IxTooltip id={`tooltip-${type}`} for={`#trigger-${type}`} placement="bottom">
            {TC_TASK_REGISTRY[type].label}
          </IxTooltip>
        </Fragment>
      ))}
    </div>
  );
}
