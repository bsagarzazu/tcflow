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

import { iconShieldCheck } from '@siemens/ix-icons/icons';
import { IxIconButton, IxTooltip } from '@siemens/ix-react';
import { Panel } from '@xyflow/react';

export function AppPrivacyNotice() {
  return (
    <>
      <Panel position="bottom-right">
        <IxIconButton
          id="trigger-privacy-notice"
          aria-describedby="tooltip-privacy-notice"
          variant="subtle-tertiary"
          icon={iconShieldCheck}
         />
      </Panel>
      <IxTooltip
        id="tooltip-privacy-notice"
        for="#trigger-privacy-notice"
        interactive
        style={{ textAlign: 'justify' }}
      >
        <p>
          TcFlow runs entirely in your browser. No personal data or workflow content is ever
          collected.
        </p>
        <p>
          Umami is used to collect anonymous usage statistics. See the detailed list of registered
          events{' '}
          <a
            href="https://github.com/bsagarzazu/tcflow/blob/main/ANALYTICS.md"
            target="_blank"
            data-umami-event="open-github"
            data-umami-event-detail="analytics"
          >
            here
          </a>
          .
        </p>
      </IxTooltip>
    </>
  );
}
