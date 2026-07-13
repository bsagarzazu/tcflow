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

import XMLBuilder from 'fast-xml-builder';
import { XMLParser } from 'fast-xml-parser';
import { type ReactFlowJsonObject } from '@xyflow/react';

import { APP_NAME, APP_VERSION, APP_AUTHOR, TC_TASK_REGISTRY } from '../constants';
import { formatTCLocation } from './utils';
import type { TaskNodeType, WorkflowEdgeType, TCTaskType, TCAction, TCHandler } from '../types';

export const serialize = (data: ReactFlowJsonObject, workflowName: string): string => {
  const idMap = new Map<string, string>();
  let idCounter = 2;

  (data.nodes as TaskNodeType[]).forEach((node) => {
    idMap.set(node.id, `id${++idCounter}`);
    node.data.actions?.forEach((action: TCAction) => {
      idMap.set(action.id, `id${++idCounter}`);
      action.handlers?.forEach((handler: TCHandler) => {
        idMap.set(handler.id, `id${++idCounter}`);
      });
    });
  });

  const now = new Date();

  const xmlObject = {
    '?xml': {
      '@_version': '1.0',
      '@_encoding': 'utf-8',
    },
    PLMXML: {
      '@_xmlns': 'http://www.plmxml.org/Schemas/PLMXMLSchema',
      '@_language': 'en-us',
      '@_time': now.toTimeString().split(' ')[0],
      '@_schemaVersion': '6',
      '@_author': `${APP_NAME} v${APP_VERSION} - ${APP_AUTHOR}`,
      '@_date': now.toISOString().split('T')[0],

      Header: {
        '@_id': 'id1',
        '@_traverseRootRefs': `id2 ${Array.from(idMap.values())
          .map((id) => `#${id}`)
          .join(' ')}`,
        '@_transferContext': 'workflow_template_mode',
      },

      WorkflowTemplate: [
        {
          '@_id': 'id2',
          '@_name': workflowName,
          '@_objectType': 'EPMTaskTemplate',
          '@_templateClassification': 'process',
          '@_subTemplateRefs': data.nodes.map((node) => `#${idMap.get(node.id)}`).join(' '),
          '@_iconKey': 'process',
        },
        ...(data.nodes as TaskNodeType[]).map((node) => {
          const config = TC_TASK_REGISTRY[node.data.type as TCTaskType];
          const dependencies = (data.edges as WorkflowEdgeType[])
            .filter((edge) => edge.target === node.id)
            .map((edge) => `#${idMap.get(edge.source)}`)
            .join(' ');

          return {
            '@_id': idMap.get(node.id),
            '@_name': node.data.name,
            '@_objectType': config.objectType,
            '@_location': formatTCLocation(node.position.x, node.position.y),
            '@_iconKey': config.tcIconKey,
            '@_dependencyTaskTemplateRefs': dependencies || undefined,
            '@_actions':
              node.data.actions?.map((action: TCAction) => `#${idMap.get(action.id)}`).join(' ') ||
              undefined,
          };
        }),
      ],

      WorkflowAction: (data.nodes as TaskNodeType[])
        .flatMap((node) =>
          node.data.actions?.map((action: TCAction) => ({
            '@_id': idMap.get(action.id),
            '@_actionType': action.actionType,
            '@_actionHandlerRefs':
              action.handlers?.map((handler: TCHandler) => `#${idMap.get(handler.id)}`).join(' ') ||
              undefined,
            '@_parentRef': `#${idMap.get(node.id)}`,
          })),
        )
        .filter(Boolean),

      WorkflowHandler: (data.nodes as TaskNodeType[])
        .flatMap((node) =>
          node.data.actions?.flatMap((action: TCAction) =>
            action.handlers?.map((handler: TCHandler) => ({
              '@_id': idMap.get(handler.id),
              '@_name': handler.name,
              Arguments:
                handler.arguments && handler.arguments.length > 0
                  ? {
                      '@_id': `args_${idMap.get(handler.id)}`,
                      '@_type': 'string',
                      UserValue: handler.arguments.map(
                        (arg: { argument: string; value: string }) => ({
                          '@_title': 'handler_argument',
                          '@_value': `${arg.argument}${arg.value ? `=${arg.value}` : ''}`,
                        }),
                      ),
                    }
                  : undefined,
            })),
          ),
        )
        .filter(Boolean),
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
