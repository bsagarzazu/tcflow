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

import { IxDropdown, IxDropdownItem } from '@siemens/ix-react';
import { iconCopy, iconCut, iconPaste, iconDuplicate, iconTrashcan } from '@siemens/ix-icons/icons';
import { useReactFlow } from '@xyflow/react';

import { useContextMenuActions } from '../hooks/useContextMenuActions';

interface ContextMenuProps {
  id: string;
  type: 'node' | 'edge' | 'pane';
  top: number;
  left: number;
  onClick?: () => void;
}

export function ContextMenu({ id, type, top, left, onClick }: ContextMenuProps) {
  const {
    cutTaskNode,
    copyTaskNode,
    pasteTaskNode,
    duplicateTaskNode,
    deleteTaskNode,
    deleteEdge,
  } = useContextMenuActions(id);
  const { getNode } = useReactFlow();

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
        {type === 'node' && (
          <>
            {getNode(id)?.deletable !== false && (
              <>
                <IxDropdownItem icon={iconCut} label="Cut" onClick={cutTaskNode}></IxDropdownItem>
                <IxDropdownItem
                  icon={iconCopy}
                  label="Copy"
                  onClick={() => {
                    copyTaskNode();
                    onClick?.();
                  }}
                ></IxDropdownItem>
                <IxDropdownItem
                  icon={iconPaste}
                  label="Paste"
                  onClick={() => {
                    pasteTaskNode({ x: top, y: left });
                    onClick?.();
                  }}
                ></IxDropdownItem>
                <IxDropdownItem
                  icon={iconDuplicate}
                  label="Duplicate"
                  onClick={() => {
                    duplicateTaskNode();
                    onClick?.();
                  }}
                ></IxDropdownItem>
                <IxDropdownItem
                  icon={iconTrashcan}
                  label="Delete"
                  onClick={() => {
                    deleteTaskNode();
                    onClick?.();
                  }}
                ></IxDropdownItem>
              </>
            )}

            {getNode(id)?.deletable === false && (
              <>
                <IxDropdownItem
                  icon={iconPaste}
                  label="Paste"
                  onClick={() => {
                    pasteTaskNode({ x: top, y: left });
                    onClick?.();
                  }}
                ></IxDropdownItem>
              </>
            )}
          </>
        )}

        {type === 'edge' && (
          <>
            <IxDropdownItem
              icon={iconTrashcan}
              label="Delete Edge"
              onClick={() => {
                deleteEdge();
                onClick?.();
              }}
            ></IxDropdownItem>
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
            ></IxDropdownItem>
          </>
        )}
      </IxDropdown>
    </div>
  );
}
