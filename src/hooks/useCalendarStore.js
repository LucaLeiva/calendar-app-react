import { useDispatch, useSelector } from "react-redux"
import calendarApi from "../api/calendarApi";
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from "../store/calendar/calendarSlice";


export const useCalendarStore = () => {
  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector(state => state.calendar);
  const { user } = useSelector(state => state.auth);

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  }

  const startSavingEvent = async(calendarEvent) => {
    if (calendarEvent._id) {
      // actualizando
      dispatch(onUpdateEvent({...calendarEvent}));
    } else {
      // creando
      const { data } = await calendarApi.post("/eventos", {
        titulo: calendarEvent.title,
        inicio: calendarEvent.start,
        fin: calendarEvent.end,
        notas: calendarEvent.notes
      });
      console.log({data});

      dispatch(onAddNewEvent({...calendarEvent, id: data.evento.id, user}));
    }
  }

  const startDeletingEvent = () => {
    dispatch(onDeleteEvent());
  }

  return {
    events,
    activeEvent,
    hasEventSelected: !! activeEvent,
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent
  }
}