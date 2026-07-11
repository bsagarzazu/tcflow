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

import {
  IxButton,
  IxLayoutGrid,
  IxRow,
  IxCol,
  IxIcon,
  IxModalContent,
  IxModalFooter,
  IxModalHeader,
  Modal,
  type ModalRef,
} from '@siemens/ix-react';
import { useRef, useState } from 'react';

import { useWorkflowStore } from '../../store/useWorkflowStore';
import { TC_TASK_REGISTRY } from '../../constants';
import { type TaskNodeType } from '../../types';
import { AppEditableText } from '../app';
import { TaskHandlerHierarchy } from './TaskHandlerHierarchy';

type TaskPropertiesProps = {
  nodeId: string;
};

export function TaskProperties({ nodeId }: TaskPropertiesProps) {
  const [selectedHandlerId, setSelectedHandlerId] = useState<string | null>(null);
  const modalRef = useRef<ModalRef>(null);

  const taskNode = useWorkflowStore((state) =>
    state.workflows[state.activeWorkflowId]?.nodes.find((node) => node.id === nodeId),
  ) as TaskNodeType;

  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  const dismiss = () => {
    modalRef.current?.dismiss('dismiss');
  };

  return (
    <Modal ref={modalRef} size="840">
      <IxModalHeader onCloseClick={() => dismiss()}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '1rem',
            fontWeight: 'bold',
            fontSize: '1.1rem',
          }}
        >
          <IxIcon size="32" name={TC_TASK_REGISTRY[taskNode.data.type].ixIcon}></IxIcon>
          <AppEditableText
            value={taskNode.data.name}
            onSave={(newName) => updateNodeData(taskNode.id, { ...taskNode.data, name: newName })}
          />
        </div>
      </IxModalHeader>
      <IxModalContent>
        <IxLayoutGrid>
          <IxRow>
            <IxCol size="4">
              <TaskHandlerHierarchy
                taskNodeId={taskNode.id}
                handlerId={selectedHandlerId}
                setHandlerId={setSelectedHandlerId}
              />
            </IxCol>
            <IxCol size="8">
              <form id="task-properties-form"></form>
            </IxCol>
          </IxRow>
        </IxLayoutGrid>
      </IxModalContent>
      <IxModalFooter>
        <IxButton variant="secondary" onClick={() => dismiss()}>
          Cancel
        </IxButton>
        <IxButton variant="primary" type="submit" form="task-properties-form">
          Save
        </IxButton>
      </IxModalFooter>
    </Modal>
  );
}
