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

type TaskPropertiesFormData = TaskNodeType['data'] & {
  newHandler: {
    name: string;
    isRule: boolean;
    arguments: any[];
  };
  tempActionType: string;
};

export function TaskProperties({ nodeId }: TaskPropertiesProps) {
  const [selectedHandlerId, setSelectedHandlerId] = useState<string | null>(null);
  const modalRef = useRef<ModalRef>(null);

  const taskNode = useWorkflowStore((state) =>
    state.workflows[state.activeWorkflowId]?.nodes.find((node) => node.id === nodeId),
  ) as TaskNodeType;

  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  const methods = useForm<TaskPropertiesFormData>({
    defaultValues: {
      ...taskNode.data,
      newHandler: { name: '', isRule: false, arguments: [] },
      tempActionType: '2',
    },
  });

  const { watch, setValue, handleSubmit } = methods;
  const currentName = watch('name');

  const onClose = () => {
    modalRef.current?.close('close');
  };

  const onSubmit = (data: TaskPropertiesFormData) => {
    const { newHandler, tempActionType, ...cleanData } = data;

    const finalData = {
      ...cleanData,
      actions: cleanData.actions.map((action) => ({
        ...action,
        handlers: action.handlers.map((handler) => ({
          ...handler,
          arguments: handler.arguments.filter((arg) => arg.argument && arg.argument.trim() !== ''),
        })),
      })),
    };

    updateNodeData(taskNode.id, finalData);
    modalRef.current?.close('submit');
  };

  return (
    <Modal ref={modalRef} size="840">
      <IxModalHeader onCloseClick={onClose}>
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
          {taskNode.data.type === 'Start' || taskNode.data.type === 'End' ? (
            <span>{currentName}</span>
          ) : (
            <AppEditableText value={currentName} onSave={(newName) => setValue('name', newName)} />
          )}
        </div>
      </IxModalHeader>

      <IxModalContent style={{ overflow: 'hidden' }}>
        <FormProvider {...methods}>
          <form id="task-properties-form" onSubmit={handleSubmit(onSubmit)}>
            <IxLayoutGrid>
              <IxRow>
                <IxCol size="4">
                  <TaskHandlerHierarchy
                    handlerId={selectedHandlerId}
                    setHandlerId={setSelectedHandlerId}
                  />
                </IxCol>
                <IxCol size="8">
                  <TaskHandlerEditor
                    handlerId={selectedHandlerId}
                    setHandlerId={setSelectedHandlerId}
                  />
                </IxCol>
              </IxRow>
            </IxLayoutGrid>
          </form>
        </FormProvider>
      </IxModalContent>

      <IxModalFooter>
        <IxButton variant="secondary" onClick={onClose}>
          Cancel
        </IxButton>
        <IxButton variant="primary" type="submit" form="task-properties-form">
          Save
        </IxButton>
      </IxModalFooter>
    </Modal>
  );
}
