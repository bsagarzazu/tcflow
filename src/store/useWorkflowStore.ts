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

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
import {
  type NodeChange,
  applyNodeChanges,
  type EdgeChange,
  applyEdgeChanges,
  addEdge,
  type Connection,
  type Viewport,
} from '@xyflow/react';

import { generateId } from '../core/utils';
import { type TaskNodeType, type WorkflowEdgeType } from '../types';

interface Workflow {
  name: string;
  nodes: TaskNodeType[];
  edges: WorkflowEdgeType[];
  viewport: Viewport;
}

interface WorkflowState {
  workflows: Record<string, Workflow>;
  activeWorkflowId: string;

  addWorkflow: (name: string) => void;
  renameWorkflow: (workflowId: string, newName: string) => void;
  setActiveWorkflow: (workflowId: string) => void;
  closeWorkflow: (workflowId: string) => void;

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onViewportChange: (viewport: Viewport) => void;
  onConnect: (connection: Connection) => void;
  setNodes: (nodes: TaskNodeType[]) => void;
  setEdges: (edges: WorkflowEdgeType[]) => void;
  updateNodeData: (id: string, newData: Partial<TaskNodeType['data']>) => void;
  updateEdge: (
    id: string,
    type: 'success' | 'failure' | 'conditional',
    conditionValue?: 'True' | 'False',
  ) => void;
}

const getInitialNodes = (): TaskNodeType[] => [
  {
    id: 'start',
    type: 'task',
    position: { x: 0, y: 0 },
    data: { type: 'Start', name: 'Start', actions: [] },
    deletable: false,
  },
  {
    id: 'end',
    type: 'task',
    position: { x: 800, y: 0 },
    data: { type: 'End', name: 'End', actions: [] },
    deletable: false,
  },
];

const initialId = generateId();

const cleanWorkflowForStorage = (workflow: Workflow) => ({
  ...workflow,
  nodes: workflow.nodes.map(({ selected, dragging, measured, ...rest }) => rest),
  edges: workflow.edges.map(({ selected, ...rest }) => rest),
});

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    temporal(
      (set) => ({
        workflows: {
          [initialId]: {
            name: 'New Workflow',
            nodes: getInitialNodes(),
            edges: [],
            viewport: { x: 0, y: 0, zoom: 1 },
          },
        },
        activeWorkflowId: initialId,

        addWorkflow: (name: string) => {
          const id = generateId();
          set((state) => ({
            workflows: {
              ...state.workflows,
              [id]: {
                name,
                nodes: getInitialNodes(),
                edges: [],
                viewport: { x: 0, y: 0, zoom: 1 },
              },
            },
            activeWorkflowId: id,
          }));
        },

        renameWorkflow: (id: string, newName: string) => {
          set((state) => ({
            workflows: {
              ...state.workflows,
              [id]: {
                ...state.workflows[id],
                name: newName,
              },
            },
          }));
        },

        setActiveWorkflow: (id: string) => {
          set({ activeWorkflowId: id });
        },

        closeWorkflow: (id: string) => {
          set((state) => {
            const { [id]: _, ...remainingWorkflows } = state.workflows;
            const keys = Object.keys(remainingWorkflows);

            let nextActiveId = state.activeWorkflowId;
            if (id === state.activeWorkflowId) {
              nextActiveId = keys[0] || '';
            }

            return {
              workflows: remainingWorkflows,
              activeWorkflowId: nextActiveId,
            };
          });
        },

        onNodesChange: (changes: NodeChange[]) => {
          set((state) => {
            const activeId = state.activeWorkflowId;
            const activeWorkflow = state.workflows[activeId];

            return {
              workflows: {
                ...state.workflows,
                [activeId]: {
                  ...activeWorkflow,
                  nodes: applyNodeChanges(changes, activeWorkflow.nodes) as TaskNodeType[],
                },
              },
            };
          });
        },

        onEdgesChange: (changes: EdgeChange[]) => {
          set((state) => {
            const activeId = state.activeWorkflowId;
            const activeWorkflow = state.workflows[activeId];

            return {
              workflows: {
                ...state.workflows,
                [activeId]: {
                  ...activeWorkflow,
                  edges: applyEdgeChanges(changes, activeWorkflow.edges) as WorkflowEdgeType[],
                },
              },
            };
          });
        },

        onViewportChange: (viewport: Viewport) => {
          set((state) => {
            const activeId = state.activeWorkflowId;
            const activeWorkflow = state.workflows[activeId];

            return {
              workflows: {
                ...state.workflows,
                [activeId]: {
                  ...activeWorkflow,
                  viewport,
                },
              },
            };
          });
        },

        onConnect: (connection: Connection) => {
          set((state) => {
            const activeId = state.activeWorkflowId;
            const activeWorkflow = state.workflows[activeId];

            const sourceNode = activeWorkflow.nodes.find((node) => node.id === connection.source);
            const isCondition = sourceNode?.data.type === 'Condition';
            const existingEdgesFromSource = activeWorkflow.edges.filter(
              (edge) => edge.source === connection.source,
            );
            const conditionValue: 'True' | 'False' | undefined = isCondition
              ? existingEdgesFromSource.length === 0
                ? 'True'
                : 'False'
              : undefined;

            const newEdge: WorkflowEdgeType = {
              ...connection,
              id: generateId(),
              data: {
                type: isCondition ? 'conditional' : 'success',
                conditionValue: conditionValue,
              },
              label: conditionValue,
            };

            return {
              workflows: {
                ...state.workflows,
                [activeId]: {
                  ...activeWorkflow,
                  edges: addEdge(newEdge, activeWorkflow.edges) as WorkflowEdgeType[],
                },
              },
            };
          });
        },

        setNodes: (nodes: TaskNodeType[]) => {
          set((state) => {
            const activeId = state.activeWorkflowId;
            const activeWorkflow = state.workflows[activeId];

            return {
              workflows: {
                ...state.workflows,
                [activeId]: {
                  ...activeWorkflow,
                  nodes,
                },
              },
            };
          });
        },

        setEdges: (edges: WorkflowEdgeType[]) => {
          set((state) => {
            const activeId = state.activeWorkflowId;
            const activeWorkflow = state.workflows[activeId];

            return {
              workflows: {
                ...state.workflows,
                [activeId]: {
                  ...activeWorkflow,
                  edges,
                },
              },
            };
          });
        },

        updateNodeData: (id: string, newData: Partial<TaskNodeType['data']>) => {
          set((state) => {
            const activeId = state.activeWorkflowId;
            const activeWorkflow = state.workflows[activeId];

            return {
              workflows: {
                ...state.workflows,
                [activeId]: {
                  ...activeWorkflow,
                  nodes: activeWorkflow.nodes.map((node) =>
                    node.id === id ? { ...node, data: { ...node.data, ...newData } } : node,
                  ),
                },
              },
            };
          });
        },

        updateEdge: (
          id: string,
          type: 'success' | 'failure' | 'conditional',
          conditionValue?: 'True' | 'False',
        ) => {
          set((state) => {
            const activeId = state.activeWorkflowId;
            const activeWorkflow = state.workflows[activeId];

            return {
              workflows: {
                ...state.workflows,
                [activeId]: {
                  ...activeWorkflow,
                  edges: activeWorkflow.edges.map((edge) =>
                    edge.id === id
                      ? {
                          ...edge,
                          label: conditionValue,
                          style: {
                            ...edge.style,
                            strokeDasharray: type === 'failure' ? '5,5' : '0',
                          },
                          data: { ...edge.data, type: type, conditionValue: conditionValue },
                        }
                      : edge,
                  ),
                },
              },
            };
          });
        },
      }),
      {
        partialize: (state) => ({
          activeWorkflowId: state.activeWorkflowId,
          workflows: Object.fromEntries(
            Object.entries(state.workflows).map(([id, workflow]) => [
              id,
              cleanWorkflowForStorage(workflow),
            ]),
          ),
        }),
        handleSet: (handleSet) => {
          let timeout: ReturnType<typeof setTimeout>;
          return (state) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => handleSet(state), 500);
          };
        },
        limit: 100,
      },
    ),
    {
      name: 'tcflow-workflow-data',
      partialize: (state) => ({
        activeWorkflowId: state.activeWorkflowId,
        workflows: Object.fromEntries(
          Object.entries(state.workflows).map(([id, workflow]) => [
            id,
            cleanWorkflowForStorage(workflow),
          ]),
        ),
      }),
    },
  ),
);
