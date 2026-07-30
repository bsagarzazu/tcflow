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

import { useRef, useState, useEffect } from 'react';
import { themeSwitcher } from '@siemens/ix';
import { IxModalContent, IxModalHeader, Modal, type ModalRef } from '@siemens/ix-react';
import { registerTheme, resolveEChartThemeName, getComputedCSSProperty } from '@siemens/ix-echarts';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { type EChartsOption } from 'echarts';

function useEChartTheme() {
  const [theme, setTheme] = useState(resolveEChartThemeName);

  useEffect(() => {
    const disposer = themeSwitcher.themeChanged.on(() => {
      setTheme(resolveEChartThemeName());
    });

    return () => {
      disposer.dispose();
    };
  }, []);

  return theme;
}

export function AnalyticsDashboard() {
  registerTheme(echarts);
  const theme = useEChartTheme();

  const modalRef = useRef<ModalRef>(null);

  const data = [
    { value: 29.4, name: 'China' },
    { value: 14.3, name: 'U.S' },
    { value: 9.8, name: 'EEA' },
    { value: 6.8, name: 'India' },
    { value: 4.9, name: 'Russia' },
    { value: 3.5, name: 'Japan' },
    { value: 31.5, name: 'Other' },
  ];

  const locationOptions: EChartsOption = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      icon: 'rect',
      bottom: '0',
    },
    series: [
      {
        name: 'CO2 emissions from<',
        type: 'pie',
        radius: '80%',
        data: data,
        label: {
          show: true,
          color: getComputedCSSProperty('color-neutral'),
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return (
    <Modal ref={modalRef} size="full-width">
      <IxModalHeader onCloseClick={() => modalRef.current?.close('close')}>
        Analytics Dashboard
      </IxModalHeader>
      <IxModalContent>
        <ReactECharts option={locationOptions} theme={theme} />
      </IxModalContent>
    </Modal>
  );
}
