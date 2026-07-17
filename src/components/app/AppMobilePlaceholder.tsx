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

import { IxButton } from '@siemens/ix-react';
import { iconGithubLogo, iconLightDark } from '@siemens/ix-icons/icons';

import { APP_REPO } from '../../constants';
import { useAppStore } from '../../store/useAppStore';
import { bannerTcFlowSvg } from '../../assets/icons';

export function AppMobilePlaceholder() {
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{ width: '200px', marginBottom: '50px' }}
        dangerouslySetInnerHTML={{ __html: bannerTcFlowSvg }}
      />
      <span
        style={{
          textAlign: 'center',
          maxWidth: '280px',
          marginTop: '0px',
          marginBottom: '60px',
          lineHeight: '1.5',
          color: 'var(--theme-color-std-text)',
        }}
      >
        TcFlow is a complex engineering tool optimized for large screens. Please switch to a desktop
        computer to design and export workflows.
      </span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        <IxButton
          variant="subtle-tertiary"
          icon={iconGithubLogo}
          onClick={() => window.open(APP_REPO, '_blank')}
          data-umami-event="open-github"
          data-umami-event-detail="main"
          data-umami-event-device="mobile"
        >
          Open GitHub
        </IxButton>
        <IxButton
          variant="subtle-tertiary"
          icon={iconLightDark}
          onClick={toggleTheme}
          data-umami-event="toggle-theme"
          data-umami-event-device="mobile"
        >
          Toggle Theme
        </IxButton>
      </div>
    </div>
  );
}
