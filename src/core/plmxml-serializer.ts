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

import { create } from 'xmlbuilder2';
import { type ReactFlowJsonObject } from '@xyflow/react';

import { formatTCLocation } from './utils';
import { APP_VERSION, OBJECT_TYPE_MAP } from '../constants';

export const serialize = (data: ReactFlowJsonObject): string => {
  const idMap = new Map<string, string>();
  data.nodes.forEach((node, index) => {
    idMap.set(node.id, `id${index + 2}`); // id1 is reserved for Header
  });

  const now = new Date();
  const root = create({ version: '1.0', encoding: 'utf-8' }).ele('PLMXML', {
    xmlns: 'http://www.plmxml.org/Schemas/PLMXMLSchema',
    language: 'en-us',
    time: now.toISOString().split('T')[1].slice(0, 8),
    schemaVersion: '6',
    author: `TCFlow v${APP_VERSION} by Beñat Sagarzazu`,
    date: now.toISOString().split('T')[0],
  });

  const idList = Array.from(idMap.values())
    .map((id) => `#${id}`)
    .join(' ');
  root.ele('Header', {
    id: 'id1',
    traverseRootRefs: idList,
    transferContext: 'workflow_template_mode',
  });

  data.nodes.forEach((node) => {
    const xmlId = idMap.get(node.id);

    const dependencies = data.edges
      .filter((edge) => edge.target === node.id)
      .map((edge) => `#${idMap.get(edge.source)}`)
      .join(' ');

    root.ele('WorkflowTemplate', {
      id: xmlId,
      name: node.data.name,
      objectType: OBJECT_TYPE_MAP[node.data.type as string] || 'EPMTaskTemplate',
      location: formatTCLocation(node.position.x, node.position.y),
      dependencyTaskTemplateRefs: dependencies || undefined,
    });
  });

  return root.end({ prettyPrint: true });
};
