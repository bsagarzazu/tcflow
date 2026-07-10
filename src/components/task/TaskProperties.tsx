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
  IxIconButton,
  IxLayoutGrid,
  IxRow,
  IxCol,
  IxInput,
  IxSelect,
  IxToggle,
  IxIcon,
  IxModalContent,
  IxModalFooter,
  IxModalHeader,
  Modal,
  type ModalRef,
} from '@siemens/ix-react';
import { iconAddCircleFilled } from '@siemens/ix-icons/icons';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useWorkflowStore } from '../../store/useWorkflowStore';
import { TC_TASK_REGISTRY } from '../../constants';
import { type TaskNodeType } from '../../types';
import { AppEditableText } from '../app';

type TaskPropertiesProps = {
  node: TaskNodeType;
};

export function TaskProperties({ node }: TaskPropertiesProps) {
  const modalRef = useRef<ModalRef>(null);
  const [isRuleHandler, setIsRuleHandler] = useState(false);

  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  const handleToggleChange = (event: any) => {
    setIsRuleHandler(event.detail);
  };

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
          <IxIcon size="32" name={TC_TASK_REGISTRY[node.data.type].ixIcon}></IxIcon>
          <AppEditableText
            value={node.data.name}
            onSave={(value) => updateNodeData(node.id, { ...node.data, name: value })}
          />
        </div>
      </IxModalHeader>
      <IxModalContent>
        <form id="task-properties-form" onSubmit={handleSubmit(onSubmit)}>
          <IxLayoutGrid>
            <IxRow>
              <IxCol size="4"></IxCol>
              <IxCol size="8">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '2rem',
                    }}
                  >
                    <IxToggle
                      text-off="Action Handler"
                      text-on="Rule Handler"
                      style={{ minWidth: '20ch', flexShrink: 0 }}
                      onCheckedChange={handleToggleChange}
                    ></IxToggle>
                    <IxSelect
                      editable
                      i18nPlaceholderEditable={
                        isRuleHandler ? 'Select a Rule Handler' : 'Select an Action Handler'
                      }
                      style={{ flexGrow: 1 }}
                    ></IxSelect>
                  </div>
                  <table className="ix-table">
                    <thead>
                      <tr>
                        <th scope="col">Argument</th>
                        <th scope="col">Parameters</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <IxInput {...register('name', { required: true })}></IxInput>
                        </td>
                        <td>
                          <IxInput {...register('name', { required: true })}></IxInput>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} style={{ border: 'none', textAlign: 'right' }}>
                          <IxIconButton
                            variant="subtle-tertiary"
                            icon={iconAddCircleFilled}
                          ></IxIconButton>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </IxCol>
            </IxRow>
          </IxLayoutGrid>
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
