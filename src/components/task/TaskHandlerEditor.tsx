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

import { IxToggle, IxSelect, IxSelectItem, IxButton, IxFieldLabel } from '@siemens/ix-react';
import { useMemo } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import { TaskHandlerArguments } from './TaskHandlerArguments';

import { TC_ACTION_REGISTRY } from '../../constants';
import type { TaskNodeType } from '../../types';
import { generateId } from '../../core/utils';

export function TaskHandlerEditor({
  handlerId,
  setHandlerId,
}: {
  handlerId: string | null;
  setHandlerId: (id: string | null) => void;
}) {
  const { control, watch, setValue, getValues } = useFormContext<TaskNodeType['data']>();
  const actions = watch('actions');

  const { actionIndex, handlerIndex } = useMemo(() => {
    if (!handlerId) return { actionIndex: -1, handlerIndex: -1 };
    for (let i = 0; i < actions.length; i++) {
      const handlerIndex = actions[i].handlers.findIndex((handler) => handler.id === handlerId);
      if (handlerIndex !== -1) {
        return { actionIndex: i, handlerIndex: handlerIndex };
      }
    }
    return { actionIndex: -1, handlerIndex: -1 };
  }, [handlerId, actions]);

  const isEditing = handlerId !== null && actionIndex !== -1 && handlerIndex !== -1;

  const handlerPath = isEditing ? `actions.${actionIndex}.handlers.${handlerIndex}` : 'newHandler';

  const { remove } = useFieldArray({
    control,
    name: `actions.${actionIndex === -1 ? 0 : actionIndex}.handlers` as any,
  });

  const handleCreate = () => {
    const data = getValues('newHandler' as any);
    const targetActionType = getValues('tempActionType' as any);
    const targetActionIndex = actions.findIndex(
      (action) => action.actionType === Number(targetActionType),
    );

    const newHandler = { ...data, id: generateId() };
    const updatedHandlers = [...actions[targetActionIndex].handlers, newHandler];

    setValue(`actions.${targetActionIndex}.handlers`, updatedHandlers);
    setHandlerId(newHandler.id);

    setValue('newHandler' as any, { name: '', isRule: false, arguments: [] });
  };

  const handleDelete = () => {
    remove(handlerIndex);
    setHandlerId(null);
  };

  const handleMoveAction = (newActionType: string) => {
    const targetActionType = Number(newActionType);
    const currentActions = getValues('actions');

    const targetActionIndex = currentActions.findIndex(
      (action) => action.actionType === targetActionType,
    );
    if (targetActionIndex === -1 || targetActionIndex === actionIndex) return;

    const handlerData = getValues(handlerPath as any);

    // Remove the handler from the current action
    const sourceHandlers = currentActions[actionIndex].handlers.filter(
      (handler) => handler.id !== handlerId,
    );
    setValue(`actions.${actionIndex}.handlers`, sourceHandlers);

    // Add the handler to the target action
    const targetHandlers = [...currentActions[targetActionIndex].handlers, handlerData];
    setValue(`actions.${targetActionIndex}.handlers`, targetHandlers);
  };

  const isRule = watch(`${handlerPath}.isRule` as any);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <IxFieldLabel htmlFor="action-select">Action</IxFieldLabel>
        <Controller
          control={control}
          name={isEditing ? (`actions.${actionIndex}.actionType` as any) : 'tempActionType'}
          render={({ field }) => (
            <IxSelect
              id="action-select"
              value={field.value}
              i18nSelectListHeader="Select an Action"
              onValueChange={(event) => {
                if (isEditing) {
                  handleMoveAction(event.detail as string);
                } else {
                  setValue('tempActionType' as any, event.detail);
                }
              }}
              style={{ width: '25%' }}
            >
              {Object.entries(TC_ACTION_REGISTRY).map(([actionNumber, actionName]) => (
                <IxSelectItem value={actionNumber} label={actionName}></IxSelectItem>
              ))}
            </IxSelect>
          )}
        />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <Controller
          control={control}
          name={`${handlerPath}.isRule` as any}
          render={({ field }) => (
            <IxToggle
              text-off="Action Handler"
              text-on="Rule Handler"
              style={{ width: '35%' }}
              onCheckedChange={(event) => field.onChange(event.detail)}
            ></IxToggle>
          )}
        />
        <Controller
          control={control}
          name={`${handlerPath}.name` as any}
          render={({ field }) => (
            <IxSelect
              editable
              value={field.value}
              onValueChange={(event) => field.onChange(event.detail)}
              i18nPlaceholderEditable={
                isRule ? 'Select a Rule Handler' : 'Select an Action Handler'
              }
              style={{ flexGrow: 1 }}
            ></IxSelect>
          )}
        />
      </div>

      <TaskHandlerArguments handlerPath={handlerPath} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '1rem',
        }}
      >
        <IxButton variant="subtle-secondary" onClick={handleCreate}>
          Create
        </IxButton>
        <IxButton variant="danger-secondary" disabled={!isEditing} onClick={handleDelete}>
          Delete
        </IxButton>
      </div>
    </div>
  );
}
