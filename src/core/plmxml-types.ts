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

export interface PLMXMLUserValue {
  '@_title': string;
  '@_value': string;
}

export interface PLMXMLArguments {
  '@_id': string;
  '@_type': string;
  UserValue: PLMXMLUserValue[];
}

export interface PLMXMLHandler {
  '@_id': string;
  '@_name': string;
  Arguments?: PLMXMLArguments;
}

export interface PLMXMLAction {
  '@_id': string;
  '@_actionType': string | number;
  '@_actionHandlerRefs'?: string;
  '@_parentRef'?: string;
}

export interface PLMXMLWorkflowTemplate {
  '@_id': string;
  '@_name': string;
  '@_objectType': string;
  '@_location': string;
  '@_iconKey'?: string;
  '@_dependencyTaskTemplateRefs'?: string;
  '@_actions'?: string;
  '@_templateClassification'?: string;
  '@_subTemplateRefs'?: string;
}

export interface PLMXMLRoot {
  Header: {
    '@_id': string;
    '@_traverseRootRefs': string;
  };
  WorkflowTemplate?: PLMXMLWorkflowTemplate[];
  WorkflowAction?: PLMXMLAction[];
  WorkflowHandler?: PLMXMLHandler[];
}