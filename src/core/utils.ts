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

import { TC_ACTION_REGISTRY } from '../constants';
import { type TCAction, type TCActionType, type TaskNodeType } from '../types';

export const generateId = () => `tcflow-${crypto.randomUUID()}`;

export const getActions = (): TCAction[] => {
  return (Object.keys(TC_ACTION_REGISTRY) as unknown as TCAction[]).map((type) => ({
    id: generateId(),
    actionType: Number(type) as TCActionType,
    handlers: [],
  }));
};

export const getInitialNodes = (): TaskNodeType[] => [
  {
    id: 'start',
    type: 'task',
    position: { x: 0, y: 0 },
    data: { type: 'Start', name: 'Start', actions: getActions() },
    deletable: false,
  },
  {
    id: 'end',
    type: 'task',
    position: { x: 800, y: 0 },
    data: { type: 'End', name: 'End', actions: getActions() },
    deletable: false,
  },
];

export const decimalToHex = (decimal: number): string => Math.round(decimal).toString(16);
export const hexToDecimal = (hex: string): number => parseInt(hex, 16);

export const formatTCLocation = (x: number, y: number): string => {
  const hexX = decimalToHex(x);
  const hexY = decimalToHex(y);
  return `${hexX},${hexY},4,64,168,63`;
};
