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

import { IxApplication, IxContent, IxSpinner } from '@siemens/ix-react';
import { ReactFlowProvider } from '@xyflow/react';
import { useEffect, useState } from 'react';

import { useAppStore } from './store/useAppStore';
import { useWorkflowStore } from './store/useWorkflowStore';
import { AppHeader, AppMenu, AppTabs, AppMobilePlaceholder } from './components/app';
import { WorkflowCanvas, WorkflowHierarchy } from './components/workflow';

export default function App() {
  const hasHydrated = useWorkflowStore.persist.hasHydrated() && useAppStore.persist.hasHydrated();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!hasHydrated) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
      >
        <IxSpinner size="large"></IxSpinner>
      </div>
    );
  }

  return (
    <IxApplication>
      {isMobile ? (
        <AppMobilePlaceholder />
      ) : (
        <ReactFlowProvider>
          <AppHeader />

          <AppMenu />

          <IxContent style={{ padding: 0 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <AppTabs />

              <div style={{ display: 'flex', width: '100%', flex: '1', overflow: 'hidden' }}>
                <WorkflowCanvas />
                <WorkflowHierarchy />
              </div>
            </div>
          </IxContent>
        </ReactFlowProvider>
      )}
    </IxApplication>
  );
}
