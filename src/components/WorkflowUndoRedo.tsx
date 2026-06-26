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

import { ControlButton, Panel, type PanelPosition } from '@xyflow/react';
import { IxIcon } from '@siemens/ix-react';
import { iconUndo, iconRedo } from '@siemens/ix-icons/icons';
import { useStore } from 'zustand';

import { useWorkflowStore } from '../store/useWorkflowStore';

interface WorkflowUndoRedoProps {
  position: PanelPosition;
}

export function WorkflowUndoRedo({ position }: WorkflowUndoRedoProps) {
  const { undo, redo } = useWorkflowStore.temporal.getState();

  const canUndo = useStore(useWorkflowStore.temporal, (state) => state.pastStates.length > 0);
  const canRedo = useStore(useWorkflowStore.temporal, (state) => state.futureStates.length > 0);

  return (
    <Panel position={position} style={{ display: 'flex', flexDirection: 'column' }}>
      <ControlButton disabled={!canUndo} onClick={() => undo()}>
        <IxIcon name={iconUndo} size="16" style={{ opacity: canUndo ? 1 : 0.4 }}></IxIcon>
      </ControlButton>
      <ControlButton disabled={!canRedo} onClick={() => redo()}>
        <IxIcon name={iconRedo} size="16" style={{ opacity: canRedo ? 1 : 0.4 }}></IxIcon>
      </ControlButton>
    </Panel>
  );
}
