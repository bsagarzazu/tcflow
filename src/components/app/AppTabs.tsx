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

import { IxTabs, IxTabItem, IxIcon } from '@siemens/ix-react';
import { iconAddCircleFilled } from '@siemens/ix-icons/icons';

import { AppEditableText } from './AppEditableText';

import { useWorkflowStore } from '../../store/useWorkflowStore';

export function AppTabs() {
  const workflows = useWorkflowStore((state) => state.workflows);
  const activeWorkflowId = useWorkflowStore((state) => state.activeWorkflowId);
  const addWorkflow = useWorkflowStore((state) => state.addWorkflow);
  const renameWorkflow = useWorkflowStore((state) => state.renameWorkflow);
  const setActiveWorkflow = useWorkflowStore((state) => state.setActiveWorkflow);
  const closeWorkflow = useWorkflowStore((state) => state.closeWorkflow);

  const workflowList = Object.entries(workflows);
  return (
    <IxTabs
      activeTabKey={activeWorkflowId}
      onTabChange={(e) => e.detail && e.detail !== 'tab-add' && setActiveWorkflow(e.detail)}
    >
      {workflowList.map(([id, workflow]) => (
        <IxTabItem
          key={id}
          tabKey={id}
          closable={workflowList.length > 1}
          onTabClose={(e) => e.detail.tabKey && closeWorkflow(e.detail.tabKey)}
        >
          <AppEditableText
            value={workflow.name}
            onSave={(newName) => renameWorkflow(id, newName)}
          />
        </IxTabItem>
      ))}
      <IxTabItem
        tabKey="tab-add"
        onTabClick={() => addWorkflow(`New Workflow (${workflowList.length})`)}
        data-umami-event="create"
        data-umami-event-object="workflow"
      >
        <IxIcon name={iconAddCircleFilled}></IxIcon>
      </IxTabItem>
    </IxTabs>
  );
}
