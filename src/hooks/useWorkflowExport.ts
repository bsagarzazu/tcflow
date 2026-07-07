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

import { useReactFlow, getNodesBounds, getViewportForBounds } from '@xyflow/react';
import { toPng, toSvg } from 'html-to-image';

import { serialize } from '../core/serializer';

const imageWidth = 1024;
const imageHeight = 768;

export function useWorkflowExport() {
  const { getNodes, toObject } = useReactFlow();

  function triggerDownload(url: string, filename: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  }

  const exportAsImage = (format: 'png' | 'svg') => {
    const element = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!element) return;

    const nodesBounds = getNodesBounds(getNodes());
    const viewport = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2, 2);

    const props = {
      backgroundColor: '#23233C',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    };

    if (format === 'png') {
      toPng(element, props).then((dataUrl) => triggerDownload(dataUrl, 'tcflow_export.png'));
    } else {
      toSvg(element, props).then((dataUrl) => triggerDownload(dataUrl, 'tcflow_export.svg'));
    }
  };

  const exportAsJson = () => {
    const flowData = toObject();

    const jsonString = serialize(flowData);

    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, 'tcflow_export.json');
    URL.revokeObjectURL(url);
  };

  const exportAsPlmxml = () => {};

  return { exportAsImage, exportAsJson, exportAsPlmxml };
}
