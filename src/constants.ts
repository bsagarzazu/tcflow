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

import {
  iconPlayFilled,
  iconStopFilled,
  iconArrowDownRight,
  iconRhombFilled,
  iconFlare,
  iconUserManagementFilled,
  iconCheck,
  iconTasksAll,
} from '@siemens/ix-icons/icons';

export const APP_NAME = 'TcFlow';
export const APP_VERSION = '0.5.0';
export const APP_AUTHOR = 'Beñat Sagarzazu';
export const APP_URL = 'https://bsagarzazu.github.io/tcflow';
export const APP_REPO = 'https://github.com/bsagarzazu/tcflow';

export const TC_TASK_REGISTRY = {
  Start: {
    ixIcon: iconPlayFilled,
    tcIconKey: 'process',
    objectType: 'EPMTaskTemplate',
    label: 'Start',
  },
  End: {
    ixIcon: iconStopFilled,
    tcIconKey: 'process',
    objectType: 'EPMTaskTemplate',
    label: 'End',
  },
  Acknowledge: {
    ixIcon: iconArrowDownRight,
    tcIconKey: 'acknowledgeTask',
    objectType: 'EPMAcknowledgeTaskTemplate',
    label: 'Acknowledge',
  },
  Condition: {
    ixIcon: iconRhombFilled,
    tcIconKey: 'conditionTask',
    objectType: 'EPMConditionTaskTemplate',
    label: 'Condition',
  },
  Do: {
    ixIcon: iconFlare,
    tcIconKey: 'doTask',
    objectType: 'EPMDoTaskTemplate',
    label: 'Do',
  },
  Or: {
    ixIcon: 'custom-icon-or-task',
    tcIconKey: 'orTask',
    objectType: 'EPMOrTaskTemplate',
    label: 'Or',
  },
  Review: {
    ixIcon: 'custom-icon-review-task',
    tcIconKey: 'reviewTask',
    objectType: 'EPMReviewTaskTemplate',
    label: 'Review',
  },
  Route: {
    ixIcon: iconUserManagementFilled,
    tcIconKey: 'routeTask',
    objectType: 'EPMRouteTaskTemplate',
    label: 'Route',
  },
  Task: {
    ixIcon: iconTasksAll,
    tcIconKey: 'task',
    objectType: 'EPMTaskTemplate',
    label: 'Task',
  },
  Validate: {
    ixIcon: iconCheck,
    tcIconKey: 'validateTask',
    objectType: 'EPMValidateTaskTemplate',
    label: 'Validate',
  },
  AddStatus: {
    ixIcon: 'custom-icon-add-status-task',
    tcIconKey: 'addStatusTask',
    objectType: 'EPMAddStatusTaskTemplate',
    label: 'Add Status',
  },
} as const;

export const TC_ACTION_REGISTRY = {
  2: 'Start',
  4: 'Complete',
  8: 'Skip',
  100: 'Perform',
} as const;
