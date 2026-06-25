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
  IxButton,
  IxLayoutAuto,
  IxInput,
  IxModalContent,
  IxModalFooter,
  IxModalHeader,
  Modal,
  type ModalRef,
} from '@siemens/ix-react';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';

import { type TaskNodeType } from '../types';
import { useWorkflowStore } from '../store/useWorkflowStore';

type TaskPropertiesProps = {
  node: TaskNodeType;
};

export function TaskProperties({ node }: TaskPropertiesProps) {
  const modalRef = useRef<ModalRef>(null);
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  const { register, handleSubmit } = useForm<TaskNodeType['data']>({
    mode: 'onTouched',
    defaultValues: {
      name: node.data.name,
      type: node.data.type,
    },
  });

  const dismiss = () => {
    modalRef.current?.dismiss('dismiss');
  };

  const onSubmit = (data: TaskNodeType['data']) => {
    updateNodeData(node.id, data);
    modalRef.current?.close(data);
  };

  return (
    <Modal ref={modalRef}>
      <IxModalHeader onCloseClick={() => dismiss()}>Task Properties</IxModalHeader>
      <IxModalContent>
        <form id="task-properties-form" onSubmit={handleSubmit(onSubmit)}>
          <IxLayoutAuto>
            <IxInput label="Task Name" {...register('name', { required: true })}></IxInput>
            <IxInput label="Task Type" {...register('type', { required: true })}></IxInput>
          </IxLayoutAuto>
        </form>
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
