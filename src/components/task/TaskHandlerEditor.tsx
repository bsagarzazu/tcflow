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
import { Controller, useFormContext, type FieldPath } from 'react-hook-form';

import { TaskHandlerArguments } from './TaskHandlerArguments';

import { TC_ACTION_REGISTRY, TC_ACTION_ORDER } from '../../constants';
import type { TaskPropertiesFormData } from '../../types';
import { generateId } from '../../core/utils';

export function TaskHandlerEditor({
  handlerId,
  setHandlerId,
  onUpdate,
}: {
  handlerId: string | null;
  setHandlerId: (id: string | null) => void;
  onUpdate: () => void;
}) {
  const { control, watch, setValue, getValues } = useFormContext<TaskPropertiesFormData>();
  const actions = watch('actions');
  const tempActionType = watch('tempActionType') as string;

  let actionIndex = -1;
  let handlerIndex = -1;

  if (handlerId) {
    for (let i = 0; i < actions.length; i++) {
      const foundHandlerIndex = actions[i].handlers.findIndex(
        (handler) => handler.id === handlerId,
      );
      if (foundHandlerIndex !== -1) {
        actionIndex = i;
        handlerIndex = foundHandlerIndex;
        break;
      }
    }
  }

  const isEditing = handlerId !== null && actionIndex !== -1 && handlerIndex !== -1;

  const handlerPath = isEditing ? `actions.${actionIndex}.handlers.${handlerIndex}` : 'newHandler';

  const handleCreate = () => {
    const data = watch(handlerPath as FieldPath<TaskPropertiesFormData>) as {
      name: string;
      isRule: boolean;
      arguments: { argument: string; value: string }[];
    };

    const targetActionType = isEditing
      ? actions[actionIndex].actionType
      : Number(getValues('tempActionType' as FieldPath<TaskPropertiesFormData>) as string);

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

    setValue('actions', updatedActions, { shouldDirty: true });

    if (!isEditing) {
      setValue('newHandler' as FieldPath<TaskPropertiesFormData>, {
        name: '',
        isRule: false,
        arguments: [],
      });
    }

    setHandlerId(newHandler.id);
    onUpdate();
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

    setValue('actions', updatedActions, { shouldDirty: true });
    setHandlerId(null);
    onUpdate();
  };

  const handleMoveAction = (newActionType: string) => {
    const targetActionType = Number(newActionType);
    const currentActions = getValues('actions');
    const targetActionIndex = currentActions.findIndex(
      (action) => action.actionType === targetActionType,
    );

    if (targetActionIndex === -1 || targetActionIndex === actionIndex) return;

    const handlerData = getValues(handlerPath as FieldPath<TaskPropertiesFormData>) as {
      id: string;
      name: string;
      isRule: boolean;
      arguments: { argument: string; value: string }[];
    };

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

    setValue('actions', newActions, { shouldDirty: true });
    setHandlerId(handlerData.id);
    onUpdate();
  };

  const isRule = watch(`${handlerPath}.isRule` as FieldPath<TaskPropertiesFormData>) as boolean;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
              setValue('tempActionType' as FieldPath<TaskPropertiesFormData>, newValue);
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
          name={`${handlerPath}.isRule` as FieldPath<TaskPropertiesFormData>}
          render={({ field }) => (
            <IxToggle
              checked={field.value as boolean}
              text-off="Action Handler"
              text-on="Rule Handler"
              style={{ width: '35%' }}
              onCheckedChange={(event) => field.onChange(event.detail)}
            ></IxToggle>
          )}
        />
        <Controller
          control={control}
          name={`${handlerPath}.name` as FieldPath<TaskPropertiesFormData>}
          render={({ field }) => (
            <IxSelect
              editable
              value={field.value as string}
              onValueChange={(event) => field.onChange(event.detail)}
              onIxBlur={() => onUpdate()}
              i18nPlaceholderEditable={
                isRule ? 'Select a Rule Handler' : 'Select an Action Handler'
              }
              style={{ flexGrow: 1 }}
            >
              {(field.value as string) && (
                <IxSelectItem
                  value={field.value as string}
                  label={field.value as string}
                ></IxSelectItem>
              )}
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
          disabled={!isEditing}
          onClick={() => setHandlerId(null)}
        >
          New
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
