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

import { iconWarning } from '@siemens/ix-icons/icons';
import { IxIconButton, IxTooltip } from '@siemens/ix-react';
import { Panel } from '@xyflow/react';

export function AppBetaNotice() {
  return (
    <>
      <Panel position="top-right">
        <IxIconButton
          id="trigger-beta-notice"
          aria-describedby="tooltip-beta-notice"
          variant="subtle-tertiary"
          icon={iconWarning}
        ></IxIconButton>
      </Panel>
      <IxTooltip
        id="tooltip-beta-notice"
        for="#trigger-beta-notice"
        interactive
        style={{ textAlign: 'justify' }}
      >
        <p>
          As a beta release, TcFlow is expected to have multiple bugs, mainly related to the PLMXML
          interoperability, as well as{' '}
          <a
            href="https://github.com/bsagarzazu/tcflow/#features"
            target="_blank"
            data-umami-event="open-github"
            data-umami-event-detail="limitations"
          >
            the following limitations
          </a>
          .
        </p>
        <p>
          If you find any bugs or have questions or feature requests, please{' '}
          <a
            href="https://github.com/bsagarzazu/tcflow/issues/new/choose"
            target="_blank"
            data-umami-event="open-github"
            data-umami-event-detail="new-issue"
          >
            create an issue
          </a>
          .
        </p>
      </IxTooltip>
    </>
  );
}
