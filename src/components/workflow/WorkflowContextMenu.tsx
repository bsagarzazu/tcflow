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

import {
  iconCopy,
  iconCut,
  iconPaste,
  iconDuplicate,
  iconTrashcan,
  iconDataTypeBoolean,
  iconSuccess,
  iconNamurFailure,
} from '@siemens/ix-icons/icons';
import { IxDivider, IxDropdown, IxDropdownItem } from '@siemens/ix-react';
import { useReactFlow } from '@xyflow/react';

import { useContextMenuActions } from '../../hooks';

interface ContextMenuProps {
  id: string;
  type: 'node' | 'edge' | 'pane';
  top: number;
  left: number;
  onClick?: () => void;
}

export function WorkflowContextMenu({ id, type, top, left, onClick }: ContextMenuProps) {
  const {
    cutTaskNode,
    copyTaskNode,
    pasteTaskNode,
    duplicateTaskNode,
    deleteTaskNode,
    deleteEdge,
    updateEdgeType,
  } = useContextMenuActions(id);

  const { getNode, getEdge } = useReactFlow();

  const node = type === 'node' ? getNode(id) : null;
  const edge = type === 'edge' ? getEdge(id) : null;

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 1000,
        top: top,
        left: left,
      }}
    >
      <IxDropdown show={true}>
        {type === 'node' && node && (
          <>
            {node.deletable !== false && (
              <>
                <IxDropdownItem
                  icon={iconCut}
                  label="Cut"
                  onClick={() => {
                    cutTaskNode();
                    onClick?.();
                  }}
                 />
                <IxDropdownItem
                  icon={iconCopy}
                  label="Copy"
                  onClick={() => {
                    copyTaskNode();
                    onClick?.();
                  }}
                 />
                <IxDropdownItem
                  icon={iconPaste}
                  label="Paste"
                  onClick={() => {
                    pasteTaskNode({ x: top, y: left });
                    onClick?.();
                  }}
                 />
                <IxDropdownItem
                  icon={iconDuplicate}
                  label="Duplicate"
                  onClick={() => {
                    duplicateTaskNode();
                    onClick?.();
                  }}
                 />
                <IxDropdownItem
                  icon={iconTrashcan}
                  label="Delete"
                  onClick={() => {
                    deleteTaskNode();
                    onClick?.();
                  }}
                 />
              </>
            )}

            {node.deletable === false && (
              <>
                <IxDropdownItem
                  icon={iconPaste}
                  label="Paste"
                  onClick={() => {
                    pasteTaskNode({ x: top, y: left });
                    onClick?.();
                  }}
                 />
              </>
            )}
          </>
        )}

        {type === 'edge' && edge && (
          <>
            {edge.data?.type === 'conditional' ? (
              <>
                {edge.data?.conditionValue === 'False' && (
                  <IxDropdownItem
                    icon={iconDataTypeBoolean}
                    label="Set as True"
                    onClick={() => {
                      updateEdgeType('conditional', 'True');
                      onClick?.();
                    }}
                   />
                )}
                {edge.data?.conditionValue === 'True' && (
                  <IxDropdownItem
                    icon={iconDataTypeBoolean}
                    label="Set as False"
                    onClick={() => {
                      updateEdgeType('conditional', 'False');
                      onClick?.();
                    }}
                   />
                )}
              </>
            ) : (
              <>
                {edge.data?.type !== 'success' && (
                  <IxDropdownItem
                    icon={iconSuccess}
                    label="Set as Success"
                    onClick={() => {
                      updateEdgeType('success', undefined);
                      onClick?.();
                    }}
                   />
                )}
                {edge.data?.type !== 'failure' && (
                  <IxDropdownItem
                    icon={iconNamurFailure}
                    label="Set as Failure"
                    onClick={() => {
                      updateEdgeType('failure', undefined);
                      onClick?.();
                    }}
                   />
                )}
              </>
            )}
            <IxDivider />
            <IxDropdownItem
              icon={iconTrashcan}
              label="Delete Edge"
              onClick={() => {
                deleteEdge();
                onClick?.();
              }}
             />
          </>
        )}

        {type === 'pane' && (
          <>
            <IxDropdownItem
              icon={iconPaste}
              label="Paste"
              onClick={() => {
                pasteTaskNode({ x: top, y: left });
                onClick?.();
              }}
             />
          </>
        )}
      </IxDropdown>
    </div>
  );
}
