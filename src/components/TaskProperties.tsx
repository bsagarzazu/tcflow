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
  IxButton,
  IxModalContent,
  IxModalFooter,
  IxModalHeader,
  Modal,
  type ModalRef,
} from '@siemens/ix-react';
import { useRef } from 'react';
import { type Node } from '@xyflow/react';

type TaskPropertiesProps = {
  node: Node;
};

export function TaskProperties({ node }: TaskPropertiesProps) {
  const modalRef = useRef<ModalRef>(null);

  const close = () => {
    modalRef.current?.close('close');
  };

  const dismiss = () => {
    modalRef.current?.dismiss('dismiss');
  };

  return (
    <Modal ref={modalRef}>
      <IxModalHeader onCloseClick={() => dismiss()}>Task Properties</IxModalHeader>
      <IxModalContent>{node.id}</IxModalContent>
      <IxModalFooter>
        <IxButton onClick={() => dismiss()}>Cancel</IxButton>
        <IxButton onClick={() => close()}>Save</IxButton>
      </IxModalFooter>
    </Modal>
  );
}
