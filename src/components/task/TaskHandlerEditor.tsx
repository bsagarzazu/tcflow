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

import { IxToggle, IxSelect, IxInput, IxIconButton } from '@siemens/ix-react';
import {
  iconAddCircleFilled,
  iconRemoveCircleFilled,
  iconChevronUp,
  iconChevronDown,
} from '@siemens/ix-icons/icons';
import { useMemo, useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import type { TaskNodeType } from '../../types';

export function TaskHandlerEditor({ handlerId }: { handlerId: string | null }) {
  const { control, register, watch } = useFormContext<TaskNodeType['data']>();
  const [selectedArgIndex, setSelectedArgIndex] = useState<number>(0);
  const [startIndex, setStartIndex] = useState<number>(0);
  const ROWS_VISIBLE = 5;

  const actions = watch('actions');

  const { actionIndex, handlerIndex } = useMemo(() => {
    for (let i = 0; i < actions.length; i++) {
      const handlers = actions[i].handlers.findIndex((handler) => handler.id === handlerId);
      if (handlers !== -1) {
        return { actionIndex: i, handlerIndex: handlers };
      }
    }
    return { actionIndex: -1, handlerIndex: -1 };
  }, [handlerId, actions]);

  const handlerPath = `actions.${actionIndex}.handlers.${handlerIndex}`;

  const isRule = watch(`${handlerPath}.isRule` as any);

  const { fields, append, remove } = useFieldArray({
    control,
    name: `${handlerPath}.arguments` as any,
  });

  const scrollUp = () => setStartIndex((prev) => Math.max(0, prev - 1));
  const scrollDown = () => setStartIndex((prev) => Math.min(fields.length - 1, prev + 1));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
              style={{ minWidth: '20ch', flexShrink: 0 }}
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

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <table className="ix-table">
          <thead>
            <tr>
              <th style={{ width: '30%' }}>Argument</th>
              <th style={{ width: '70%' }}>Value(s)</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROWS_VISIBLE }).map((_, index) => {
              const dataIndex = startIndex + index;
              const field = fields[dataIndex];
              const isSelected = field && selectedArgIndex === dataIndex;

              return (
                <tr
                  key={field?.id || `empty-${index}`}
                  onClick={() => field && setSelectedArgIndex(dataIndex)}
                  style={{
                    backgroundColor: isSelected ? 'var(--theme-color-component-2)' : 'transparent',
                    cursor: field ? 'pointer' : 'default',
                  }}
                >
                  <td>
                    {field ? (
                      <IxInput
                        style={{ width: '100%' }}
                        {...register(`${handlerPath}.arguments.${dataIndex}.argument` as any)}
                        onFocus={() => setSelectedArgIndex(dataIndex)}
                      ></IxInput>
                    ) : (
                      <IxInput style={{ width: '100%' }} disabled></IxInput>
                    )}
                  </td>
                  <td>
                    {field ? (
                      <IxInput
                        style={{ width: '100%' }}
                        {...register(`${handlerPath}.arguments.${dataIndex}.value` as any)}
                        onFocus={() => setSelectedArgIndex(dataIndex)}
                      ></IxInput>
                    ) : (
                      <IxInput style={{ width: '100%' }} disabled></IxInput>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <IxIconButton
            variant="subtle-tertiary"
            icon={iconChevronUp}
            disabled={startIndex === 0}
            onClick={scrollUp}
          ></IxIconButton>
          <IxIconButton
            variant="subtle-tertiary"
            icon={iconChevronDown}
            disabled={startIndex + ROWS_VISIBLE >= fields.length}
            onClick={scrollDown}
          ></IxIconButton>
          <IxIconButton
            variant="subtle-tertiary"
            icon={iconAddCircleFilled}
            onClick={() => {
              append({ argument: '', value: '' });
              if (fields.length >= ROWS_VISIBLE) {
                setStartIndex(fields.length - ROWS_VISIBLE + 1);
                setSelectedArgIndex(fields.length);
              }
            }}
          ></IxIconButton>
          <IxIconButton
            variant="subtle-tertiary"
            icon={iconRemoveCircleFilled}
            disabled={!fields[selectedArgIndex]}
            onClick={() => {
              remove(selectedArgIndex);
              if (selectedArgIndex >= fields.length - 1 && selectedArgIndex > 0) {
                setSelectedArgIndex(fields.length - 1);
              }
            }}
          ></IxIconButton>
        </div>
      </div>
    </div>
  );
}
