import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { eventClearActive, eventSetActive } from '../../actions/events';
import { uiOpenModal } from '../../actions/ui';
import { AddNewFab } from '../ui/AddNewFab';
import CalendarEvent from './CalendarEvent';
import Navbar from '../ui/Navbar';
import CalendarModal from './CalendarModal';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { messages } from '../../helpers/calendar-messages-es';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { DeleteEventFab } from '../ui/DeleteEventFab';

moment.locale('es');
const localizer = momentLocalizer(moment);

const CalendarScreen = () => {
  const { events, activeEvent } = useSelector((state) => state.calendar);
  const dispatch = useDispatch();
  const [lastView, setLastView] = useState(
    localStorage.getItem('lastView') || 'month'
  );

  const onDoubleClick = (e) => {
    dispatch(uiOpenModal());
  };

  const onSelectEvent = (e) => {
    dispatch(eventSetActive(e));
  };

  const onViewChange = (e) => {
    setLastView(e);
    localStorage.setItem('lastView', e);
  };

  const onSelectSlot = () => {
    dispatch(eventClearActive());
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: '#367cf7',
      borderRadius: '0px',
      opacity: 0.8,
      display: 'block',
      color: 'white',
    };

    return {
      style,
    };
  };

  return (
    <div className="calendar-screen">
      <Navbar />
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        messages={messages}
        eventPropGetter={eventStyleGetter}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelectEvent}
        onView={onViewChange}
        onSelectSlot={onSelectSlot}
        selectable={true}
        view={lastView}
        components={{
          event: CalendarEvent,
        }}
      />
      <AddNewFab />
      {activeEvent && <DeleteEventFab />}
      <CalendarModal />
    </div>
  );
};

export default CalendarScreen;
