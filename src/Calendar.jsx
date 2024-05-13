import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function Calendar() {
  const [eventInfo, setEventInfo] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null); // Nouvel état pour la salle sélectionnée

  const handleDateClick = (arg) => {
    // Ouvre un formulaire pour saisir les informations de l'événement
    const eventData = {
      start: arg.date,
      end: arg.date, // Par simplicité, on suppose que le début et la fin sont identiques
      allDay: true, // Événement sur toute la journée par défaut
    };
    setEventInfo(eventData);
  };

  const handleEventDrop = (arg) => {
    // Met à jour l'heure de début et de fin de l'événement lorsqu'il est déplacé
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
    // Crée un nouvel objet d'événement avec les données du formulaire
    const newEvent = {
      title: formData.userName,
      roomType: formData.roomType,
      comment: formData.comment,
      start: eventInfo.start,
      end: eventInfo.end,
      allDay: eventInfo.allDay,
      participants: formData.participants,
      color: formData.color,
      id: generateEventId(), // Génère un identifiant unique pour l'événement
    };

    // Ajoute le nouvel événement au tableau des événements du calendrier
    setCalendarEvents([...calendarEvents, newEvent]);

    // Réinitialise l'état de eventInfo
    setEventInfo(null);
  };

  const generateEventId = () => {
    // Fonction simple pour générer un identifiant unique pour les événements
    return Math.random().toString(36).substring(7);
  };

  const eventRender = (info) => {
    const event = info.event;
    const userName = event.extendedProps.userName;
    const comment = event.extendedProps.comment;
    const participants = event.extendedProps.participants;

    const startDate = event.start;
    const endDate = event.end;

    const daysDiff = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
    );

    info.el.innerHTML = `
      <div>
        <strong>${userName}</strong> - ${comment} <br>
        pour ${daysDiff} ${daysDiff > 1 ? "jours" : "jour"} <br>
        ${participants ? "Participants : " + participants : ""}
      </div>
    `;
  };

  // Fonction pour filtrer les événements par salle sélectionnée
  const filteredEvents = selectedRoom
    ? calendarEvents.filter((event) => event.roomType === selectedRoom)
    : calendarEvents;

  return (
    <div>
      {/* Formulaire pour choisir une salle */}
      <div>
        <label>Choisir une salle :</label>
        <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
          <option value="">Toutes les salles</option>
          <option value="meeting">Salle de réunion</option>
          <option value="conference">Salle de conférence</option>
          <option value="event">Espace événementiel</option>
        </select>
      </div>
      {/* Calendrier */}
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
        eventDrop={handleEventDrop}
        events={filteredEvents} // Utilisation des événements filtrés
        editable={true}
        eventRender={eventRender}
      />
      {eventInfo && <EventForm eventInfo={eventInfo} onSubmit={handleSubmit} />}
    </div>
  );
}

function EventForm({ eventInfo, onSubmit }) {
  const [formData, setFormData] = useState({
    userName: "",
    roomType: "",
    comment: "",
    startDate: eventInfo.start,
    endDate: eventInfo.end,
    participants: "",
    color: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Valide les données du formulaire si nécessaire
    onSubmit(formData);
  };

  return (
    <div className="event-form">
      <h2>Nouvel événement</h2>
      <form onSubmit={handleSubmit}>
        <label>Nom de l'utilisateur :</label>
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
        />
        <label>Type de salle :</label>
        <select
          name="roomType"
          value={formData.roomType}
          onChange={handleChange}
        >
          <option value="">Sélectionner le type de salle</option>
          <option value="meeting">Salle de réunion</option>
          <option value="conference">Salle de conférence</option>
          <option value="event">Espace événementiel</option>
        </select>
        <label>Commentaire :</label>
        <textarea
          name="comment"
          value={formData.comment}
          onChange={handleChange}
        ></textarea>
        <label>Date de début :</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
        />
        <label>Date de fin :</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
        />
        <label>Participants :</label>
        <input
          type="text"
          name="participants"
          value={formData.participants}
          onChange={handleChange}
        />
        <label>Couleur :</label>
        <input
          type="color"
          name="color"
          value={formData.color}
          onChange={handleChange}
        />
        <button type="submit">Soumettre</button>
      </form>
    </div>
  );
}

export default Calendar;
