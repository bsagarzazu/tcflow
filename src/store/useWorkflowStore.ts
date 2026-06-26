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

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
import {
  type Node,
  type NodeChange,
  applyNodeChanges,
  type Edge,
  type EdgeChange,
  applyEdgeChanges,
  addEdge,
  type Connection,
  type Viewport,
} from '@xyflow/react';

import { generateId } from '../core/utils';

interface Workflow {
  name: string;
  nodes: Node[];
  edges: Edge[];
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
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateNodeData: (id: string, newData: Partial<Node['data']>) => void;
}

const getInitialNodes = (): Node[] => [
  {
    id: 'start',
    type: 'task',
    position: { x: 0, y: 0 },
    data: { type: 'Start', name: 'Start' },
    deletable: false,
  },
  {
    id: 'end',
    type: 'task',
    position: { x: 800, y: 0 },
    data: { type: 'End', name: 'End' },
    deletable: false,
  },
];

const initialId = generateId();

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
                  nodes: applyNodeChanges(changes, activeWorkflow.nodes),
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
                  edges: applyEdgeChanges(changes, activeWorkflow.edges),
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

            return {
              workflows: {
                ...state.workflows,
                [activeId]: {
                  ...activeWorkflow,
                  edges: addEdge(connection, activeWorkflow.edges),
                },
              },
            };
          });
        },

        setNodes: (nodes: Node[]) => {
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

        setEdges: (edges: Edge[]) => {
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

        updateNodeData: (id: string, newData: Partial<Node['data']>) => {
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
      }),
      {
        partialize: (state) => ({
          activeWorkflowId: state.activeWorkflowId,
          workflows: Object.fromEntries(
            Object.entries(state.workflows).map(([id, workflow]) => [
              id,
              { name: workflow.name, nodes: workflow.nodes, edges: workflow.edges },
            ]),
          ),
        }),
        handleSet: (handleSet) => {
          let timeout: ReturnType<typeof setTimeout>;
          return (state) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => handleSet(state), 300);
          };
        },
        limit: 50,
      },
    ),
    {
      name: 'tcflow-workflow-data',
      partialize: (state) => ({
        workflows: state.workflows,
        activeWorkflowId: state.activeWorkflowId,
      }),
    },
  ),
);
