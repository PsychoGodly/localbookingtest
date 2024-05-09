import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function Calendar() {
  const [eventInfo, setEventInfo] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);

  const handleDateClick = (arg) => {
    // Open a modal or a form to capture user input
    const eventData = {
      start: arg.date,
      end: arg.date, // For simplicity, assuming start and end are the same
      allDay: true, // All-day event by default
    };
    setEventInfo(eventData);
  };

  const handleEventDrop = (arg) => {
    // Update the event's start and end time when dropped on a
    const updatedEvent = {
      ...arg.event.toPlainObject(),
      start: arg.event.start,
      end: arg.event.end,
    };

    const updatedEvents = calendarEvents.map((event) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );

    setCalendarEvents(updatedEvents);
  };

  const handleSubmit = (formData) => {
    // Create a new event object with form data
    const newEvent = {
      title: formData.name,
      start: eventInfo.start,
      end: eventInfo.end,
      allDay: eventInfo.allDay,
      color: formData.color,
      otherUsers: formData.otherUsers,
      comment: formData.comment,
      id: generateEventId(), // Generate unique id for the event
    };

    // Add the new event to the calendar's events array
    setCalendarEvents([...calendarEvents, newEvent]);

    // Reset eventInfo state
    setEventInfo(null);
  };

  const generateEventId = () => {
    // Simple function to generate a unique id for events
    return Math.random().toString(36).substring(7);
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height={"90vh"}
        dateClick={handleDateClick}
        eventDrop={handleEventDrop} // Handle event drop
        events={calendarEvents} // Pass the events array to the calendar
        editable={true} // Enable event dragging
      />
      {eventInfo && (
        <EventForm eventInfo={eventInfo} onSubmit={handleSubmit} />
      )}
    </div>
  );
}

// Form component for capturing event details
function EventForm({ eventInfo, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    comment: "",
    color: "",
    otherUsers: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form data if needed
    onSubmit(formData);
  };

  return (
    <div className="event-form">
      <h2>New Event</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {/* Other form fields */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Calendar;
