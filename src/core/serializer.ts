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

import { type ReactFlowJsonObject } from '@xyflow/react';

export const serialize = (data: ReactFlowJsonObject): string => {
  const cleanNodes = data.nodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: node.data,
    deletable: node.deletable,
  }));

  const fileContent = {
    type: 'tcflow',
    version: '0.2.0',
    author: 'Beñat Sagarzazu',
    source: 'https://bsagarzazu.github.io/tcflow',
    elements: { nodes: cleanNodes, edges: data.edges, viewport: data.viewport },
  };

  return JSON.stringify(fileContent, null, 2) + '\n';
};

export const deserialize = () => {};
