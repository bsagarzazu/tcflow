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

import { useMemo } from 'react';
import { type TreeModel } from '@siemens/ix';

import { TC_ACTION_REGISTRY } from '../constants';
import { type TCAction, type TreeHandlerData } from '../types';

export function useTaskHandlerHierarchy(actions: TCAction[]) {
  return useMemo(() => {
    const model: TreeModel<TreeHandlerData> = {
      root: {
        id: 'root',
        data: { id: '', type: undefined, name: '' },
        hasChildren: true,
        children: [],
      },
    };

    if (!actions) return model;

    actions.forEach((action) => {
      model[action.id] = {
        id: action.id,
        data: {
          id: action.id,
          type: 'action',
          name: TC_ACTION_REGISTRY[action.actionType],
        },
        hasChildren: action.handlers.length > 0,
        children: [],
      };

      model.root.children.push(action.id);

      action.handlers.forEach((handler) => {
        model[handler.id] = {
          id: handler.id,
          data: {
            id: handler.id,
            type: undefined,
            name: handler.name,
          },
          hasChildren: false,
          children: [],
        };

        model[action.id].children.push(handler.id);
      });
    });

    return model;
  }, [actions]);
}
