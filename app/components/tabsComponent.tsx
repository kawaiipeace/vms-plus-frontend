import React from 'react';
import Tabs from './tabs';

export default function TabsComponent() {
  const tabs = [
    {
      label: 'รออนุมัติ',
      content: <div></div>,
      badge: '4'
    },
    {
      label: 'รับกุญแจ',
      content: <div></div>,
    },
    {
      label: 'เดินทาง',
      content: <div></div>,
    },
    {
      label: 'คืนยานพาหนะ',
      content: <div></div>,
    },
    {
      label: 'เสร็จสิ้น',
      content: <div></div>,
    },
    {
      label: 'ยกเลิก',
      content: <div></div>,
    },
  ];

  return (
    <div className="mx-auto">
      <Tabs tabs={tabs} />
    </div>
  );
};

