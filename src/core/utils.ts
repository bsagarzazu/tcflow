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

export const generateId = () => `tcflow-${crypto.randomUUID()}`;

export const decimalToHex = (decimal: number): string => Math.round(decimal).toString(16);

export const formatTCLocation = (x: number, y: number): string => {
  const hexX = decimalToHex(x);
  const hexY = decimalToHex(y);
  return `${hexX},${hexY},4,64,168,63`;
};
