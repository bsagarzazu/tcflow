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

import { useState } from 'react';
import { type TreeContext } from '@siemens/ix';
import { IxPane, IxTree } from '@siemens/ix-react';

import { useBuildWorkflowHierarchy } from '../hooks/useWorkflowHierarchy';

export function WorkflowHierarchy() {
  const treeModel = useBuildWorkflowHierarchy();
  const [context, setContext] = useState<TreeContext>({});

  return (
    <IxPane composition="right" variant="floating">
      <IxTree
        root="root"
        model={treeModel}
        context={context}
        onContextChange={({ detail }) => {
          setContext(detail);
        }}
      ></IxTree>
    </IxPane>
  );
}
