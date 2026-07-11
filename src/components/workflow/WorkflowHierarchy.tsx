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

import { useState, useCallback, useEffect } from 'react';
import { type TreeContext } from '@siemens/ix';
import { IxPane, IxTree, IxIcon, showModal } from '@siemens/ix-react';
import { useReactFlow } from '@xyflow/react';

import { useWorkflowStore } from '../../store/useWorkflowStore';
import { useBuildWorkflowHierarchy } from '../../hooks';
import { type TreeTaskData, type TaskNodeType } from '../../types';
import { AppEditableText } from '../app';
import { TaskProperties } from '../task';

export function WorkflowHierarchy() {
  const { getNode, fitView } = useReactFlow();
  const [context, setContext] = useState<TreeContext>({});
  const treeModel = useBuildWorkflowHierarchy();

  const activeWorkflowId = useWorkflowStore((state) => state.activeWorkflowId);
  const workflowName = useWorkflowStore((state) => state.workflows[activeWorkflowId].name);
  const renameWorkflow = useWorkflowStore((state) => state.renameWorkflow);
  const nodes = useWorkflowStore((state) => state.workflows[activeWorkflowId].nodes);
  const setNodes = useWorkflowStore((state) => state.setNodes);

  const selectedNodeId = nodes.find((node) => node.selected)?.id;

  useEffect(() => {
    if (!selectedNodeId) {
      setContext({});
      return;
    }
    setContext({ [selectedNodeId]: { isExpanded: false, isSelected: true } });
  }, [selectedNodeId, setContext]);

  const selectNode = useCallback(
    (event: any) => {
      const nodeId = event.detail;
      setNodes(nodes.map((node) => ({ ...node, selected: node.id === nodeId })));
      fitView({ nodes: [{ id: nodeId }], padding: 0.2, duration: 500, maxZoom: 1 });
    },
    [nodes, setNodes, fitView],
  );

  const openProperties = useCallback(
    async (nodeId: string) => {
      const node = getNode(nodeId);
      if (node) {
        await showModal({
          content: <TaskProperties node={node as TaskNodeType} />,
        });
      }
    },
    [getNode, showModal],
  );

  return (
    <IxPane composition="right" variant="floating" size="320px">
      <div
        slot="header"
        style={{
          fontWeight: 'bold',
          fontSize: '1.1rem',
        }}
      >
        <AppEditableText
          value={workflowName}
          onSave={(newName) => renameWorkflow(activeWorkflowId, newName)}
        />
      </div>
      <IxTree
        root={'root'}
        model={treeModel}
        context={context}
        onContextChange={({ detail }) => {
          setContext(detail);
        }}
        onNodeClicked={selectNode}
        renderItem={(data: TreeTaskData) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
            onDoubleClick={(event) => {
              event.stopPropagation();
              openProperties(data.id);
            }}
          >
            <IxIcon
              name={data.icon}
              size="16"
              style={{
                marginInlineEnd: '0.5rem',
              }}
            />
            {data.name}
          </div>
        )}
      ></IxTree>
    </IxPane>
  );
}
