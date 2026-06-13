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
  iconArrowDownRight,
  iconCheck,
  iconUserManagement,
  iconTasksAll,
  iconRhombFilled,
  iconFlare,
  iconFlag,
  iconEye,
  iconConnections,
} from '@siemens/ix-icons/icons';
import { IxIconButton } from '@siemens/ix-react';

export function WorkflowToolbar() {
  return (
    <div slot="secondary">
      <IxIconButton variant="tertiary" icon={iconArrowDownRight}></IxIconButton>
      <IxIconButton variant="tertiary" icon={iconRhombFilled}></IxIconButton>
      <IxIconButton variant="tertiary" icon={iconFlare}></IxIconButton>
      <IxIconButton variant="tertiary" icon={iconConnections}></IxIconButton>
      <IxIconButton variant="tertiary" icon={iconEye}></IxIconButton>
      <IxIconButton variant="tertiary" icon={iconUserManagement}></IxIconButton>
      <IxIconButton variant="tertiary" icon={iconCheck}></IxIconButton>
      <IxIconButton variant="tertiary" icon={iconTasksAll}></IxIconButton>
      <IxIconButton variant="tertiary" icon={iconFlag}></IxIconButton>
    </div>
  );
}
