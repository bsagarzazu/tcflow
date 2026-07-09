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

export function AppLogo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <svg viewBox="0 0 512 512" width="3rem" xmlns="http://www.w3.org/2000/svg">
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="36"
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          <path d="M125 179 H238 M187 179 V384" />
          <path d="M238 179 H342" />
          <path d="M318 287 H264 V384 H318" />
        </g>
        <path d="M336 138 L398 179 L336 220 Z" fill="currentColor" />
      </svg>
      <span
        style={{
          fontWeight: 'bold',
          fontSize: '1.2rem',
          letterSpacing: '0.5px',
          userSelect: 'none',
          transform: 'translateY(8px)',
          marginLeft: '-0.8rem',
        }}
      >
        Flow
      </span>
    </div>
  );
}
