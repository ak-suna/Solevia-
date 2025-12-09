// import React from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";

// export default function Calendar() {
//   return (
//     <div className="p-4 bg-white rounded-xl shadow-md">
//       <FullCalendar
//         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         headerToolbar={{
//           left: "prev,next today",
//           center: "title",
//           right: "dayGridMonth,timeGridWeek,timeGridDay",
//         }}
//         events={[
//           { title: "Sample Event", date: "2025-01-10" },
//         ]}
//         selectable={true}
//         select={(info) => {
//           alert("Selected: " + info.startStr);
//         }}
//         eventClick={(info) => {
//           alert("Event: " + info.event.title);
//         }}
//       />
//     </div>
//   );
// }
// import React from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";

// export default function Calendar() {
//   return (
//     <div className="p-4 bg-white rounded-xl shadow-md">
//       <FullCalendar
//         plugins={[dayGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         headerToolbar={{
//           left: "prev,next", // minimal navigation
//           center: "title",   // month + year in center
//           right: "",         // no week/day buttons
//         }}
//         height="auto"
//         events={[
//           { title: "Sample Event", date: "2025-01-10" },
//         ]}
//         selectable={true}
//         select={(info) => {
//           alert("Selected: " + info.startStr);
//         }}
//         eventClick={(info) => {
//           alert("Event: " + info.event.title);
//         }}
//       />
//     </div>
//   );
// }
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function Calendar({ onDateSelect }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "",
        }}
        height="auto"
        events={[
          { title: "Sample Event", date: "2025-01-10" },
        ]}

        /** 👇 This fires when the user clicks a day */
        dateClick={(info) => {
          if (onDateSelect) {
            onDateSelect(new Date(info.dateStr));
          }
        }}

        /** Optional: event click */
        eventClick={(info) => {
          console.log("Event clicked:", info.event.title);
        }}
      />
    </div>
  );
}

