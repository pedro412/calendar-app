import React from 'react';

const CalendarEvent = ({ event }) => {
  const { title, user } = event;
  return (
    <div>
      <span>
        {title} - {user.name}
      </span>
    </div>
  );
};

export default CalendarEvent;
