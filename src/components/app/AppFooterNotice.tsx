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

import { Panel } from '@xyflow/react';

import { APP_NAME, APP_VERSION, APP_AUTHOR } from '../../constants';

export function AppFooterNotice() {
  return (
    <Panel
      position="bottom-center"
      style={{ color: 'gray', opacity: 0.5, fontSize: '0.8rem', userSelect: 'none' }}
    >
      {`${APP_NAME} v${APP_VERSION} | © 2026 ${APP_AUTHOR}`}
    </Panel>
  );
}
