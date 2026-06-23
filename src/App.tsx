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

import { IxApplication, IxContent } from '@siemens/ix-react';
import { AppHeader } from './components/AppHeader';
import { AppMenu } from './components/AppMenu';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { WorkflowHierarchy } from './components/WorkflowHierarchy';
import { ReactFlowProvider } from '@xyflow/react';

export default function App() {
  return (
    <IxApplication>
      <ReactFlowProvider>
        <AppHeader />

        <AppMenu />

        <IxContent style={{ padding: 0 }}>
          <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
            <WorkflowCanvas />
            <WorkflowHierarchy />
          </div>
        </IxContent>
      </ReactFlowProvider>
    </IxApplication>
  );
}
