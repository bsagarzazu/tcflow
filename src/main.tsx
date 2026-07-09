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

import '@siemens/ix/dist/siemens-ix/siemens-ix.css';
import { IxApplicationContext } from '@siemens/ix-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';

import App from './App.tsx';
import { registerCustomIcons } from './assets/icons.ts';

registerSW({ immediate: true });
registerCustomIcons();

createRoot(document.getElementById('root')!).render(
  <IxApplicationContext>
    <StrictMode>
      <App />
    </StrictMode>
  </IxApplicationContext>,
);
