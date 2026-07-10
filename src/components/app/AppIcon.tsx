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

export function AppIcon({ size = '1.8rem' }) {
  return (
    <svg
      viewBox="103 116 299 290"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="36"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <path d="M125 179 H342" />
        <path d="M187 197 V384" />
        <path d="M318 287 H264 V384 H318" />
      </g>
      <path d="M336 138 L398 179 L336 220 Z" fill="currentColor" />
    </svg>
  );
}
