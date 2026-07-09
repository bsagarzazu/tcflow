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

import { useState } from 'react';
import { IxInput } from '@siemens/ix-react';

interface AppEditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
}

export function AppEditableText({ value, onSave }: AppEditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    if (tempValue.trim() && tempValue !== value) {
      onSave(tempValue);
    }
    setIsEditing(false);
  };
  return (
    <>
      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <IxInput
            value={tempValue}
            onValueChange={(e) => setTempValue(e.detail)}
            onIxBlur={handleSave}
          ></IxInput>
        </form>
      ) : (
        <span
          onDoubleClick={() => {
            setTempValue(value);
            setIsEditing(true);
          }}
        >
          {value}
        </span>
      )}
    </>
  );
}
