import { NavBar } from "../components/NavBar";
import { Calendar } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { localizer } from "../../helpers/calendarLocalizer";
import { getMessagesES } from "../../helpers/getMessages";
import { CalendarEvent } from "../components/CalendarEvent";
import { useState } from "react";
import { CalendarModal } from "../components/CalendarModal";
import { useUiStore } from "../../hooks/useUiStore";
import { useCalendarStore } from "../../hooks/useCalendarStore";
import { FabAddNew } from "../components/FabAddNew";
import { FabDelete } from "../components/FabDelete";


export const CalendarPage = () => {

  const { events, activeEvent, setActiveEvent } = useCalendarStore();
  const { openDateModal } = useUiStore();
  const [lastView, setLastView] = useState(localStorage.getItem("lastView") || "month");

  const eventStyleGetter = (event, start, end, isSelected) => {
    
    const style = {
      backGroundColor: "#347CF7",
      borderRadius: "0px",
      opacity: 0.8,
      color: "white"
    }
    
    return {
      style
    }
  }

  const onDoubleClick = (event) => {
    openDateModal();
  }

  const onSelect = (event) => {
    setActiveEvent(event);
  }

  const onViewChanged = (event) => {
    localStorage.setItem("lastView", event);
    setLastView(event);
  }

  return (
    <>
      <NavBar />

      <Calendar
        culture="es"
        localizer={localizer}
        events={events}
        defaultView={lastView}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc(100vh - 80px)" }}
        messages={getMessagesES()}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent
        }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChanged}
      />

      <CalendarModal />

      <FabAddNew />
      <FabDelete />
    </>
  )
}
