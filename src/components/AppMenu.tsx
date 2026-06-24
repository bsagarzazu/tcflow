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

import { IxMenu, IxMenuCategory, IxMenuItem } from '@siemens/ix-react';
import {
  iconFolderOpenFilled,
  iconDownload,
  iconImageFilled,
  iconGithubLogo,
  iconLightDark,
} from '@siemens/ix-icons/icons';
import { useWorkflowExport } from '../hooks/useWorkflowExport';

export function AppMenu() {
  const { exportAsImage } = useWorkflowExport();

  return (
    <IxMenu>
      <IxMenuItem icon={iconFolderOpenFilled}>Open</IxMenuItem>
      <IxMenuItem icon={iconDownload}>Save to...</IxMenuItem>
      <IxMenuCategory icon={iconImageFilled} label="Export image...">
        <IxMenuItem onClick={() => exportAsImage('png')}>PNG</IxMenuItem>
        <IxMenuItem onClick={() => exportAsImage('svg')}>SVG</IxMenuItem>
      </IxMenuCategory>
      <IxMenuItem icon={iconGithubLogo} slot="bottom">
        GitHub
      </IxMenuItem>
      <IxMenuItem icon={iconLightDark} slot="bottom">
        Theme
      </IxMenuItem>
    </IxMenu>
  );
}
