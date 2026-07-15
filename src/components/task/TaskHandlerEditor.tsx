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
import { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { TaskHandlerArguments } from './TaskHandlerArguments';

import { TC_ACTION_REGISTRY, TC_ACTION_ORDER } from '../../constants';
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
  const tempActionType = watch('tempActionType' as any);

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

  const handleCreate = () => {
    const data = getValues(handlerPath as any);

    const targetActionType = isEditing
      ? actions[actionIndex].actionType
      : Number(getValues('tempActionType' as any));

    const targetActionIndex = actions.findIndex(
      (action) => action.actionType === Number(targetActionType),
    );
    if (targetActionIndex === -1) return;

    const newHandler = { ...data, id: generateId() };

    const updatedActions = actions.map((action, index) => {
      if (index === targetActionIndex) {
        return {
          ...action,
          handlers: [...action.handlers, newHandler],
        };
      }
      return action;
    });

    setValue('actions', updatedActions);

    if (!isEditing) {
      setValue('newHandler' as any, { name: '', isRule: false, arguments: [] });
    }

    setHandlerId(newHandler.id);
  };

  const handleDelete = () => {
    const updatedActions = actions.map((action, index) => {
      if (index === actionIndex) {
        return {
          ...action,
          handlers: action.handlers.filter((handler) => handler.id !== handlerId),
        };
      }
      return action;
    });

    setValue('actions', updatedActions);
    setHandlerId(null);
  };

  const [clearCounter, setClearCounter] = useState(0);
  const handleClear = () => {
    setValue(handlerPath as any, { name: '', isRule: false, arguments: [] });
    setClearCounter((prev) => prev + 1);
  };

  const handleMoveAction = (newActionType: string) => {
    const targetActionType = Number(newActionType);
    const currentActions = getValues('actions');
    const targetActionIndex = currentActions.findIndex(
      (action) => action.actionType === targetActionType,
    );

    if (targetActionIndex === -1 || targetActionIndex === actionIndex) return;

    const handlerData = getValues(handlerPath as any);

    const newActions = currentActions.map((action, index) => {
      if (index === actionIndex) {
        return {
          ...action,
          handlers: action.handlers.filter((handler) => handler.id !== handlerId),
        };
      }
      if (index === targetActionIndex) {
        return {
          ...action,
          handlers: [...action.handlers, handlerData],
        };
      }
      return action;
    });

    setValue('actions', newActions);
    setHandlerId(handlerData.id);
  };

  const isRule = watch(`${handlerPath}.isRule` as any);

  return (
    <div
      key={`${handlerId}-${clearCounter}`}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <IxFieldLabel htmlFor="action-select">Action</IxFieldLabel>
        <IxSelect
          id="action-select"
          value={isEditing ? actions[actionIndex].actionType.toString() : tempActionType}
          i18nSelectListHeader="Select an Action"
          onValueChange={(event) => {
            const newValue = event.detail as string;
            if (isEditing) {
              handleMoveAction(newValue);
            } else {
              setValue('tempActionType' as any, newValue);
            }
          }}
          style={{ width: '25%' }}
        >
          {TC_ACTION_ORDER.map((actionNumber) => (
            <IxSelectItem
              key={actionNumber}
              value={actionNumber.toString()}
              label={TC_ACTION_REGISTRY[actionNumber]}
            ></IxSelectItem>
          ))}
        </IxSelect>
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
              checked={field.value}
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
            >
              {field.value && <IxSelectItem value={field.value} label={field.value}></IxSelectItem>}
            </IxSelect>
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
        <IxButton
          variant="subtle-secondary"
          disabled={
            !watch((handlerPath + '.name') as any) &&
            watch((handlerPath + '.arguments') as any).length === 0
          }
          onClick={handleClear}
        >
          Clear
        </IxButton>
        <IxButton
          variant="subtle-secondary"
          onClick={handleCreate}
          data-umami-event="create"
          data-umami-event-object="handler"
          data-umami-event-action={actions[actionIndex]?.actionType}
        >
          {isEditing ? 'Duplicate' : 'Create'}
        </IxButton>
        <IxButton variant="danger-secondary" disabled={!isEditing} onClick={handleDelete}>
          Delete
        </IxButton>
      </div>
    </div>
  );
}
