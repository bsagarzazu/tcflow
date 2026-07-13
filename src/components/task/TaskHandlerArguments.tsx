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

import { IxInput, IxIconButton } from '@siemens/ix-react';
import {
  iconAddCircleFilled,
  iconRemoveCircleFilled,
  iconChevronUp,
  iconChevronDown,
} from '@siemens/ix-icons/icons';
import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

export function TaskHandlerArguments({ handlerPath }: { handlerPath: string }) {
  const { register, control } = useFormContext();

  const [selectedArgIndex, setSelectedArgIndex] = useState<number>(0);
  const [startIndex, setStartIndex] = useState<number>(0);
  const ROWS_VISIBLE = 5;

  const { fields, append, remove } = useFieldArray({
    control,
    name: `${handlerPath}.arguments` as any,
  });

  return (
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
          onClick={() => {
            const nextIndex = Math.max(0, selectedArgIndex - 1);
            setSelectedArgIndex(nextIndex);
            if (nextIndex < startIndex) {
              setStartIndex(nextIndex);
            }
          }}
        ></IxIconButton>
        <IxIconButton
          variant="subtle-tertiary"
          icon={iconChevronDown}
          disabled={startIndex + ROWS_VISIBLE >= fields.length}
          onClick={() => {
            const nextIndex = Math.min(fields.length - 1, selectedArgIndex + 1);
            setSelectedArgIndex(nextIndex);
            if (nextIndex >= startIndex + ROWS_VISIBLE) {
              setStartIndex(nextIndex - ROWS_VISIBLE + 1);
            }
          }}
        ></IxIconButton>
        <IxIconButton
          variant="subtle-tertiary"
          icon={iconAddCircleFilled}
          onClick={() => {
            append({ argument: '', value: '' });
            const nextIndex = fields.length;
            setSelectedArgIndex(nextIndex);
            if (nextIndex >= ROWS_VISIBLE) {
              setStartIndex(nextIndex - ROWS_VISIBLE + 1);
            }
          }}
        ></IxIconButton>
        <IxIconButton
          variant="subtle-tertiary"
          icon={iconRemoveCircleFilled}
          disabled={!fields[selectedArgIndex]}
          onClick={() => {
            remove(selectedArgIndex);
            const nextIndex = Math.max(0, selectedArgIndex - 1);
            setSelectedArgIndex(nextIndex);
            if (startIndex > 0 && fields.length - 1 < startIndex + ROWS_VISIBLE) {
              setStartIndex((prev) => prev - 1);
            }
          }}
        ></IxIconButton>
      </div>
    </div>
  );
}
