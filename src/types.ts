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

import { type Node, type Edge } from '@xyflow/react';

import { TC_ACTION_REGISTRY, TC_TASK_REGISTRY } from './constants';

export type TCActionType = keyof typeof TC_ACTION_REGISTRY;
export type TCTaskType = keyof typeof TC_TASK_REGISTRY;

export interface TCHandlerArgument {
  argument: string;
  value: string;
}

export interface TCHandler {
  id: string;
  name: string;
  arguments: TCHandlerArgument[];
}

export interface TCAction {
  id: string;
  actionType: TCActionType;
  handlers: TCHandler[];
}

type TaskNodeData = {
  type: TCTaskType;
  name: string;
  actions: TCAction[];
};

export type TaskNodeType = Node<TaskNodeData, 'task'>;

type WorkflowEdgeData = {
  type: 'success' | 'failure' | 'conditional';
  conditionValue?: 'True' | 'False';
};
export type WorkflowEdgeType = Edge<WorkflowEdgeData>;

export type TreeTaskData = Partial<TaskNodeData> & { id: string; icon?: string };
export type TreeHandlerData = { id: string; name: string; type: 'action' | undefined };

export type TaskPropertiesFormData = TaskNodeType['data'] & {
  newHandler: {
    name: string;
    isRule: boolean;
    arguments: TCHandlerArgument[];
  };
  tempActionType: string;
};
