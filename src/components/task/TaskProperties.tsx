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
import { FormProvider, useForm } from 'react-hook-form';

import { useWorkflowStore } from '../../store/useWorkflowStore';
import { TC_TASK_REGISTRY } from '../../constants';
import { type TaskNodeType } from '../../types';
import { AppEditableText } from '../app';
import { TaskHandlerHierarchy } from './TaskHandlerHierarchy';
import { TaskHandlerEditor } from './TaskHandlerEditor';

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

  const methods = useForm<TaskNodeType['data']>({
    defaultValues: taskNode.data,
  });

  const onClose = () => {
    modalRef.current?.close('close');
  };

  const onSubmit = (data: TaskNodeType['data']) => {
    updateNodeData(taskNode.id, data);
    modalRef.current?.close('submit');
  };

  return (
    <Modal ref={modalRef} size="840">
      <IxModalHeader onCloseClick={() => onClose()}>
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
        <FormProvider {...methods}>
          <form id="task-properties-form" onSubmit={methods.handleSubmit(onSubmit)}>
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
                  <TaskHandlerEditor handlerId={selectedHandlerId as string} />
                </IxCol>
              </IxRow>
            </IxLayoutGrid>
          </form>
        </FormProvider>
      </IxModalContent>
      <IxModalFooter>
        <IxButton variant="secondary">Create</IxButton>
        <IxButton variant="secondary">Delete</IxButton>
        <IxButton variant="primary" type="submit" form="task-properties-form">
          Save
        </IxButton>
      </IxModalFooter>
    </Modal>
  );
}
