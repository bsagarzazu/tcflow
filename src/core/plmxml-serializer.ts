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

import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { type ReactFlowJsonObject } from '@xyflow/react';

import { APP_VERSION, APP_AUTHOR, TC_TASK_REGISTRY } from '../constants';
import { formatTCLocation } from './utils';
import { type TCTaskType } from '../types';

export const serialize = (data: ReactFlowJsonObject): string => {
  const idMap = new Map<string, string>();
  data.nodes.forEach((node, index) => {
    idMap.set(node.id, `id${index + 2}`); // id1 is reserved for Header
  });

  const now = new Date();

  const getDependencies = (nodeId: string): string =>
    data.edges
      .filter((edge) => edge.target === nodeId)
      .map((edge) => `#${idMap.get(edge.source)}`)
      .join(' ');

  const xmlObject = {
    '?xml': {
      '@_version': '1.0',
      '@_encoding': 'utf-8',
    },
    PLMXML: {
      '@_xmlns': 'http://www.plmxml.org/Schemas/PLMXMLSchema',
      '@_language': 'en-us',
      '@_time': now.toISOString().split('T')[1].slice(0, 8),
      '@_schemaVersion': '6',
      '@_author': `TCFlow v${APP_VERSION} - ${APP_AUTHOR}`,
      '@_date': now.toISOString().split('T')[0],

      Header: {
        '@_id': 'id1',
        '@_traverseRootRefs': Array.from(idMap.values())
          .map((id) => `#${id}`)
          .join(' '),
        '@_transferContext': 'workflow_template_mode',
      },

      WorkflowTemplate: data.nodes.map((node) => ({
        '@_id': idMap.get(node.id),
        '@_name': node.data.name,
        '@_objectType':
          TC_TASK_REGISTRY[node.data.type as TCTaskType].objectType || 'EPMTaskTemplate',
        '@_location': formatTCLocation(node.position.x, node.position.y),
        '@_dependencyTaskTemplateRefs': getDependencies(node.id) || undefined,
      })),
    },
  };

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    format: true,
    suppressEmptyNode: true,
  });

  return builder.build(xmlObject);
};

export const deserialize = (content: string) => {};
