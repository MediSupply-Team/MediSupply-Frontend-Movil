import React from 'react';

export const CalendarDrawer = ({ visible, onClose, onDateSelect }: any) => {
  if (!visible) return null;
  return (
    <div testID="calendar-drawer">
      <button
        testID="calendar-select-2025-10-11"
        onClick={() => onDateSelect(new Date('2025-10-11T00:00:00Z'))}
      >
        select-2025-10-11
      </button>
      <button onClick={onClose}>close</button>
    </div>
  );
};

export default CalendarDrawer;
