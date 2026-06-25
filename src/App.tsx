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

import { IxApplication, IxContent, IxTabs, IxTabItem, IxIcon } from '@siemens/ix-react';
import { iconAddCircleFilled } from '@siemens/ix-icons/icons';
import { ReactFlowProvider } from '@xyflow/react';

import { useWorkflowStore } from './store/useWorkflowStore';
import { AppHeader } from './components/AppHeader';
import { AppMenu } from './components/AppMenu';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { WorkflowHierarchy } from './components/WorkflowHierarchy';

export default function App() {
  const workflows = useWorkflowStore((state) => state.workflows);
  const activeWorkflowId = useWorkflowStore((state) => state.activeWorkflowId);
  const addWorkflow = useWorkflowStore((state) => state.addWorkflow);
  const setActiveWorkflow = useWorkflowStore((state) => state.setActiveWorkflow);
  const closeWorkflow = useWorkflowStore((state) => state.closeWorkflow);

  const workflowList = Object.entries(workflows);

  return (
    <IxApplication>
      <ReactFlowProvider>
        <AppHeader />

        <AppMenu />

        <IxContent style={{ padding: 0 }}>
          <IxTabs
            activeTabKey={activeWorkflowId}
            onTabChange={(e) => {
              if (e.detail && e.detail !== 'tab-add') {
                setActiveWorkflow(e.detail);
              }
            }}
          >
            {workflowList.map(([id, workflow]) => (
              <IxTabItem
                key={id}
                tabKey={id}
                closable={workflowList.length > 1}
                onTabClose={(e) => e.detail.tabKey && closeWorkflow(e.detail.tabKey)}
              >
                {workflow.name}
              </IxTabItem>
            ))}
            <IxTabItem
              tabKey="tab-add"
              onTabClick={() => addWorkflow(`New Workflow (${workflowList.length})`)}
            >
              <IxIcon name={iconAddCircleFilled}></IxIcon>
            </IxTabItem>
          </IxTabs>
          <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
            <WorkflowCanvas />
            <WorkflowHierarchy />
          </div>
        </IxContent>
      </ReactFlowProvider>
    </IxApplication>
  );
}
