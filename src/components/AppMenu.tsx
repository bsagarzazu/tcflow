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

import { useRef } from 'react';
import { IxMenu, IxMenuCategory, IxMenuItem } from '@siemens/ix-react';
import {
  iconFolderOpenFilled,
  iconDownload,
  iconImageFilled,
  iconGithubLogo,
  iconLightDark,
} from '@siemens/ix-icons/icons';

import { useAppStore } from '../store/useAppStore';
import { useWorkflowExport } from '../hooks/useWorkflowExport';
import { useWorkflowImport } from '../hooks/useWorkflowImport';

export function AppMenu() {
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const { exportAsImage, exportAsJson } = useWorkflowExport();
  const { importFromJson } = useWorkflowImport();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importFromJson(file);
    }

    event.target.value = '';
  };

  return (
    <IxMenu>
      <IxMenuCategory icon={iconFolderOpenFilled} label="Open workflow">
        <IxMenuItem onClick={() => fileInputRef.current?.click()}>JSON</IxMenuItem>
      </IxMenuCategory>
      <IxMenuCategory icon={iconDownload} label="Save workflow">
        <IxMenuItem onClick={exportAsJson}>JSON</IxMenuItem>
      </IxMenuCategory>
      <IxMenuCategory icon={iconImageFilled} label="Export image">
        <IxMenuItem onClick={() => exportAsImage('png')}>PNG</IxMenuItem>
        <IxMenuItem onClick={() => exportAsImage('svg')}>SVG</IxMenuItem>
      </IxMenuCategory>
      <IxMenuItem
        icon={iconGithubLogo}
        slot="bottom"
        onClick={() => window.open('https://github.com/bsagarzazu/tcflow', '_blank')}
      >
        GitHub
      </IxMenuItem>
      <IxMenuItem icon={iconLightDark} slot="bottom" onClick={toggleTheme}>
        Toggle Theme
      </IxMenuItem>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json,.tcflow"
        onChange={handleFileChange}
      />
    </IxMenu>
  );
}
