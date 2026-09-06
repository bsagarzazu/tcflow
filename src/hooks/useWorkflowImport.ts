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

import { useReactFlow } from '@xyflow/react';

import { deserialize as jsonToWorkflow } from '../core/json-serializer';
import { deserialize as plmxmlToWorkflow } from '../core/plmxml-serializer';

export function useWorkflowImport() {
  const { setNodes, setEdges, setViewport } = useReactFlow();

  const importFromFile = (file: File, format: 'tcflow' | 'plmxml') => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result;

      if (typeof content !== 'string') {
        console.error('Failed to read file content as string.');
        return;
      }

      try {
        const workflow = format === 'tcflow' ? jsonToWorkflow(content) : plmxmlToWorkflow(content);

        setNodes(workflow.nodes);
        setEdges(workflow.edges);
        if (
          workflow.viewport &&
          typeof workflow.viewport.x === 'number' &&
          typeof workflow.viewport.y === 'number'
        ) {
          setViewport(workflow.viewport);
        }
      } catch (error) {
        console.error('Failed to import workflow file.', error);
      }
    };

    reader.onerror = () => {
      console.error('Failed to read workflow file.', reader.error);
    };

    reader.readAsText(file);
  };

  return { importFromFile };
}
