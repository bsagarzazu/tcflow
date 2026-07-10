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

import { addIcons } from '@siemens/ix-icons';

// iconReviewTask and iconAddStatusTask are derived from Siemens ix-icons - MIT License - Copyright (c) 2022 Siemens AG

export const iconReviewTaskSvg = `
<svg viewBox="0 -106 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M357.333 64C386.155 64 412.802 73.858 434.431 90.5632L469.917 85.515V117.515L447.939 135.124C447.98 136.299 448 137.481 448 138.667C448 191.686 407.407 234.667 357.333 234.667C307.26 234.667 266.667 191.686 266.667 138.667C266.667 135.311 266.829 131.996 267.147 128.729C263.533 128.248 259.795 128 256 128C252.205 128 248.468 128.248 244.804 128.728C245.171 132.01 245.333 135.318 245.333 138.667C245.333 191.686 204.741 234.667 154.667 234.667C104.593 234.667 64 191.686 64 138.667L64.1067 134.485L42.6667 117.333V85.3333L77.888 90.3467L79.6532 88.9909C100.902 73.2383 126.766 64 154.667 64C182.136 64 207.63 72.9547 228.687 88.2575C237.479 86.3419 246.622 85.3333 256 85.3333C265.378 85.3333 274.52 86.3418 283.324 88.2561C304.37 72.9547 329.864 64 357.333 64ZM154.667 106.667C138.943 106.667 123.869 111.125 110.597 119.478L109.653 120.107L109.54 120.446C108.126 124.757 107.217 129.284 106.85 133.953L106.667 138.667C106.667 168.65 128.72 192 154.667 192C180.614 192 202.667 168.65 202.667 138.667C202.667 132.325 201.679 126.193 199.791 120.443L199.659 120.107L198.737 119.476C186.94 112.053 173.717 107.705 159.882 106.831L154.667 106.667ZM357.333 106.667C341.61 106.667 326.536 111.125 313.264 119.478L312.32 120.107L312.207 120.446C310.792 124.757 309.883 129.284 309.517 133.953L309.333 138.667C309.333 168.65 331.386 192 357.333 192C383.28 192 405.333 168.65 405.333 138.667C405.333 132.325 404.346 126.193 402.458 120.443L402.325 120.107L401.404 119.476C389.606 112.053 376.384 107.705 362.549 106.831L357.333 106.667Z"/>
</svg>
`;

export const iconAddStatusTaskSvg = `
<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <g id="flag-icon" transform="translate(128.000000, 85.333333)">
        <path d="M277.333333,1.42108547e-14 L213.333333,85.3333333 L277.333333,170.666667 L42.666,170.666 L42.6666667,341.333333 L0,341.333333 L0,1.42108547e-14 L277.333333,1.42108547e-14 Z"></path>
    </g>
    <g id="add-icon" transform="translate(160.000000, 240.000000) scale(0.65)">
        <path d="M234.666667,106.666667 L234.666,192 L320,192 L320,234.666667 L234.666,234.666 L234.666667,320 L192,320 L192,234.666 L106.666667,234.666667 L106.666667,192 L192,192 L192,106.666667 L234.666667,106.666667 Z"></path>
    </g>
</svg>`;

export const iconOrTaskSvg = `
<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M48,180 L180,180 L180,140 L48,140 Z M48,372 L180,372 L180,332 L48,332 Z M380,276 L464,276 L464,236 L380,236 Z M128,96 C186.667,181.333 186.667,330.667 128,416 C202.667,416 320,384 416,256 C320,128 202.667,96 128,96 Z"/>
</svg>
`;

export const registerCustomIcons = () => {
  addIcons({
    'custom-icon-review-task': iconReviewTaskSvg,
    'custom-icon-add-status-task': iconAddStatusTaskSvg,
    'custom-icon-or-task': iconOrTaskSvg,
  });
};
