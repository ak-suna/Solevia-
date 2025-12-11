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

// import React from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";

// export default function Calendar({ onDateSelect }) {
//   return (
//     <div className="p-6 w-[600px] h-[600px] rounded-xl shadow-md overflow-auto bg-[#FCF8F5]">
//       <FullCalendar
//         plugins={[dayGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         headerToolbar={{
//           left: "prev,next",
//           center: "title",
//           right: "",
//         }}
//         height="100%"
//         events={[{ title: "Sample Event", date: "2025-01-10" }]}
//         dateClick={(info) => {
//           if (onDateSelect) {
//             onDateSelect(new Date(info.dateStr));
//           }
//         }}
//         eventClick={(info) => {
//           console.log("Event clicked:", info.event.title);
//         }}
//       />
//     </div>
//   );
// }
// import React, { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { getMoodHistory } from "../services/moodCheckService";

// export default function Calendar({ onDateSelect, moodData }) {
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     if (moodData && moodData.length > 0) {
//       // Transform mood data into calendar events
//       const moodEvents = moodData.flatMap(entry => {
//         const events = [];
//         const dateStr = new Date(entry.date).toISOString().split('T')[0];
        
//         if (entry.morning) {
//           events.push({
//             id: `morning-${dateStr}`,
//             date: dateStr,
//             display: 'background',
//             classNames: ['mood-morning'],
//             extendedProps: {
//               mood: entry.morning,
//               period: 'morning'
//             }
//           });
//         }
        
//         if (entry.evening) {
//           events.push({
//             id: `evening-${dateStr}`,
//             date: dateStr,
//             display: 'background',
//             classNames: ['mood-evening'],
//             extendedProps: {
//               mood: entry.evening,
//               period: 'evening'
//             }
//           });
//         }
        
//         return events;
//       });
      
//       setEvents(moodEvents);
//     }
//   }, [moodData]);

//   const renderDayCell = (info) => {
//     const dateStr = info.date.toISOString().split('T')[0];
//     const dayMoods = moodData?.find(entry => 
//       new Date(entry.date).toISOString().split('T')[0] === dateStr
//     );

//     if (!dayMoods) return null;

//     return (
//       <div className="absolute top-0 left-0 w-full flex justify-between px-1 pt-1 pointer-events-none">
//         {dayMoods.morning && (
//           <img 
//             src={`/images/emoji/${dayMoods.morning.emoji}.png`}
//             alt={dayMoods.morning.label}
//             className="w-5 h-5 rounded-full"
//             title={`Morning: ${dayMoods.morning.label}`}
//           />
//         )}
//         {dayMoods.evening && (
//           <img 
//             src={`/images/emoji/${dayMoods.evening.emoji}.png`}
//             alt={dayMoods.evening.label}
//             className="w-5 h-5 rounded-full"
//             title={`Evening: ${dayMoods.evening.label}`}
//           />
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="p-6 w-[600px] h-[600px] rounded-xl shadow-md overflow-auto bg-[#FCF8F5]">
//       <style>{`
//         .fc-daygrid-day {
//           position: relative;
//         }
//         .fc-daygrid-day-frame {
//           position: relative;
//         }
//       `}</style>
//       <FullCalendar
//         plugins={[dayGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         headerToolbar={{
//           left: "prev,next",
//           center: "title",
//           right: "",
//         }}
//         height="100%"
//         events={events}
//         dateClick={(info) => {
//           if (onDateSelect) {
//             onDateSelect(new Date(info.dateStr));
//           }
//         }}
//         dayCellDidMount={(info) => {
//           const container = info.el.querySelector('.fc-daygrid-day-top');
//           if (container) {
//             const dateStr = info.date.toISOString().split('T')[0];
//             const dayMoods = moodData?.find(entry => 
//               new Date(entry.date).toISOString().split('T')[0] === dateStr
//             );

//             if (dayMoods) {
//               const moodContainer = document.createElement('div');
//               moodContainer.className = 'flex justify-between items-start w-full px-1 absolute top-0 left-0 pointer-events-none';
              
//               if (dayMoods.morning) {
//                 const morningImg = document.createElement('img');
//                 morningImg.src = `/images/emoji/${dayMoods.morning.emoji}.png`;
//                 morningImg.alt = dayMoods.morning.label;
//                 morningImg.className = 'w-5 h-5 rounded-full';
//                 morningImg.title = `Morning: ${dayMoods.morning.label}`;
//                 moodContainer.appendChild(morningImg);
//               } else {
//                 moodContainer.appendChild(document.createElement('div'));
//               }
              
//               if (dayMoods.evening) {
//                 const eveningImg = document.createElement('img');
//                 eveningImg.src = `/images/emoji/${dayMoods.evening.emoji}.png`;
//                 eveningImg.alt = dayMoods.evening.label;
//                 eveningImg.className = 'w-5 h-5 rounded-full';
//                 eveningImg.title = `Evening: ${dayMoods.evening.label}`;
//                 moodContainer.appendChild(eveningImg);
//               }
              
//               info.el.querySelector('.fc-daygrid-day-frame').appendChild(moodContainer);
//             }
//           }
//         }}
//       />
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";

// export default function Calendar({ onDateSelect, moodData }) {
//   return (
//     <div className="p-6 w-[600px] h-[600px] rounded-xl shadow-md overflow-auto bg-[#FCF8F5]">
//       <style>{`
//         .fc-daygrid-day {
//           position: relative;
//         }
//         .fc-daygrid-day-frame {
//           position: relative;
//           min-height: 80px;
//         }
//         .fc-daygrid-day-top {
//           flex-direction: row;
//           justify-content: flex-start;
//         }
//         .mood-emojis-container {
//           position: absolute;
//           bottom: 4px;
//           left: 0;
//           right: 0;
//           display: flex;
//           justify-content: space-between;
//           padding: 0 4px;
//           pointer-events: none;
//           z-index: 3;
//         }
//         .mood-emoji {
//           width: 24px;
//           height: 24px;
//           border-radius: 50%;
//           object-fit: cover;
//           box-shadow: 0 1px 3px rgba(0,0,0,0.2);
//         }
//         .mood-emoji-morning {
//           margin-right: auto;
//         }
//         .mood-emoji-evening {
//           margin-left: auto;
//         }
//       `}</style>
//       <FullCalendar
//         plugins={[dayGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         headerToolbar={{
//           left: "prev,next",
//           center: "title",
//           right: "",
//         }}
//         height="100%"
//         dateClick={(info) => {
//           if (onDateSelect) {
//             onDateSelect(new Date(info.dateStr));
//           }
//         }}
//         dayCellDidMount={(info) => {
//           if (!moodData || moodData.length === 0) return;
          
//           const dateStr = info.date.toISOString().split('T')[0];
//           const dayMoods = moodData.find(entry => 
//             new Date(entry.date).toISOString().split('T')[0] === dateStr
//           );

//           if (dayMoods && (dayMoods.morning || dayMoods.evening)) {
//             const frame = info.el.querySelector('.fc-daygrid-day-frame');
//             if (frame) {
//               const moodContainer = document.createElement('div');
//               moodContainer.className = 'mood-emojis-container';
              
//               if (dayMoods.morning) {
//   const morningImg = document.createElement('img');
//   morningImg.src = dayMoods.morning.emoji; // Use directly, no modifications
//   morningImg.alt = dayMoods.morning.label;
//   morningImg.className = 'mood-emoji mood-emoji-morning';
//   morningImg.title = `Morning: ${dayMoods.morning.label}`;
//   moodContainer.appendChild(morningImg);
// }

// if (dayMoods.evening) {
//   const eveningImg = document.createElement('img');
//   eveningImg.src = dayMoods.evening.emoji; // Use directly, no modifications
//   eveningImg.alt = dayMoods.evening.label;
//   eveningImg.className = 'mood-emoji mood-emoji-evening';
//   eveningImg.title = `Evening: ${dayMoods.evening.label}`;
//   moodContainer.appendChild(eveningImg);
// }
              
//               frame.appendChild(moodContainer);
//             }
//           }
//         }}
//       />
//     </div>
//   );
// }
// import React, { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";

// export default function Calendar({ onDateSelect, moodData }) {
//   const [calendarEvents, setCalendarEvents] = useState([]);

//   useEffect(() => {
//     console.log("📅 Calendar received moodData:", moodData);
    
//     if (!moodData || moodData.length === 0) {
//       setCalendarEvents([]);
//       return;
//     }

//     // Create events for FullCalendar
//     const events = moodData.flatMap(entry => {
//       const dateStr = new Date(entry.date).toISOString().split('T')[0];
//       const events = [];

//       if (entry.morning) {
//         events.push({
//           id: `morning-${dateStr}`,
//           date: dateStr,
//           display: 'background',
//           extendedProps: {
//             type: 'morning',
//             emoji: entry.morning.emoji,
//             label: entry.morning.label
//           }
//         });
//       }

//       if (entry.evening) {
//         events.push({
//           id: `evening-${dateStr}`,
//           date: dateStr,
//           display: 'background',
//           extendedProps: {
//             type: 'evening',
//             emoji: entry.evening.emoji,
//             label: entry.evening.label
//           }
//         });
//       }

//       return events;
//     });

//     console.log("📊 Created events:", events);
//     setCalendarEvents(events);
//   }, [moodData]);

//   const renderDayCellContent = (arg) => {
//     const dateStr = arg.date.toISOString().split('T')[0];
//     const dayMoods = moodData?.find(entry => 
//       new Date(entry.date).toISOString().split('T')[0] === dateStr
//     );

//     return (
//       <div className="relative w-full h-full">
//         {/* Date number */}
//         <div className="fc-daygrid-day-number">{arg.dayNumberText}</div>
        
//         {/* Mood emojis */}
//         {dayMoods && (
//           <div className="absolute bottom-1 left-0 right-0 flex justify-between px-1">
//             {dayMoods.morning && (
//               <img 
//                 src={dayMoods.morning.emoji}
//                 alt={dayMoods.morning.label}
//                 title={`Morning: ${dayMoods.morning.label}`}
//                 className="w-6 h-6 rounded-full object-cover shadow-md"
//               />
//             )}
//             {dayMoods.evening && (
//               <img 
//                 src={dayMoods.evening.emoji}
//                 alt={dayMoods.evening.label}
//                 title={`Evening: ${dayMoods.evening.label}`}
//                 className="w-6 h-6 rounded-full object-cover shadow-md"
//               />
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="p-6 w-[600px] h-[600px] rounded-xl shadow-md overflow-auto bg-[#FCF8F5]">
//       <style>{`
//         .fc-daygrid-day-frame {
//           min-height: 80px;
//           position: relative;
//         }
//         .fc .fc-daygrid-day-top {
//           display: flex;
//           flex-direction: row;
//         }
//       `}</style>
//       <FullCalendar
//         plugins={[dayGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         headerToolbar={{
//           left: "prev,next",
//           center: "title",
//           right: "",
//         }}
//         height="100%"
//         events={calendarEvents}
//         dateClick={(info) => {
//           console.log("📅 Date clicked:", info.dateStr);
//           if (onDateSelect) {
//             onDateSelect(new Date(info.dateStr));
//           }
//         }}
//         dayCellContent={renderDayCellContent}
//       />
//     </div>
//   );
// }

//this one is milkeo witout the color thing 

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function Calendar({ onDateSelect, moodData }) {
  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    console.log("📅 Calendar received moodData:", moodData);
    
    if (!moodData || moodData.length === 0) {
      setCalendarEvents([]);
      return;
    }

    // Create events for FullCalendar
    const events = moodData.flatMap(entry => {
      const entryDate = new Date(entry.date);
      const year = entryDate.getFullYear();
      const month = String(entryDate.getMonth() + 1).padStart(2, '0');
      const day = String(entryDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const events = [];

      if (entry.morning) {
        events.push({
          id: `morning-${dateStr}`,
          date: dateStr,
          display: 'background',
          backgroundColor: 'transparent',
          extendedProps: {
            type: 'morning',
            emoji: entry.morning.emoji,
            label: entry.morning.label,
            color: entry.morning.color
          }
        });
      }

      if (entry.evening) {
        events.push({
          id: `evening-${dateStr}`,
          date: dateStr,
          display: 'background',
          backgroundColor: 'transparent',
          extendedProps: {
            type: 'evening',
            emoji: entry.evening.emoji,
            label: entry.evening.label,
            color: entry.evening.color
          }
        });
      }

      return events;
    });

    console.log("📊 Created events:", events);
    setCalendarEvents(events);
  }, [moodData]);

  const renderDayCellContent = (arg) => {
    // Use local date string to avoid timezone issues
    const year = arg.date.getFullYear();
    const month = String(arg.date.getMonth() + 1).padStart(2, '0');
    const day = String(arg.date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const dayMoods = moodData?.find(entry => {
      const entryDate = new Date(entry.date);
      const entryYear = entryDate.getFullYear();
      const entryMonth = String(entryDate.getMonth() + 1).padStart(2, '0');
      const entryDay = String(entryDate.getDate()).padStart(2, '0');
      const entryDateStr = `${entryYear}-${entryMonth}-${entryDay}`;
      return entryDateStr === dateStr;
    });

    return (
      <div className="relative w-full h-full p-1"
      style={{ fontFamily: "Brasika" }}>
        {/* Date number */}
        <div className="text-sm font-medium text-gray-700 mb-1">
          {arg.dayNumberText}
        </div>
        
        {/* Mood emojis container - positioned at bottom */}
        {dayMoods && (dayMoods.morning || dayMoods.evening) && (
          <div className="absolute bottom left-0 right-0 flex justify-center items-center gap-2.5 px-1 top-[50px]">
            {/* Morning emoji - LEFT side */}
            {dayMoods.morning && (
              <div className="flex-shrink-0">
                <img 
                  src={dayMoods.morning.emoji}
                  alt={dayMoods.morning.label}
                  title={`Morning: ${dayMoods.morning.label}`}
                  className="w-8 h-8 object-contain drop-shadow-md hover:scale-110 transition-transform"
                  onError={(e) => {
                    console.error('Failed to load morning emoji:', dayMoods.morning.emoji);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            {/* Evening emoji - RIGHT side */}
            {dayMoods.evening && (
              <div className="flex-shrink-0">
                <img 
                  src={dayMoods.evening.emoji}
                  alt={dayMoods.evening.label}
                  title={`Evening: ${dayMoods.evening.label}`}
                  className="w-8 h-8 object-contain drop-shadow-md hover:scale-110 transition-transform"
                  onError={(e) => {
                    console.error('Failed to load evening emoji:', dayMoods.evening.emoji);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 w-[600px] h-[600px] rounded-xl shadow-md overflow-auto bg-[#FCF8F5]">
      <style>{`
      
/* Fix emoji sticking to top — force correct container */
.fc-daygrid-day-frame > div {
  position: relative !important;
}


        /* Ensure calendar cells have enough height */
        .fc-daygrid-day-frame {
          min-height: 100px !important;
          position: relative;
          cursor: pointer;
        }
        
        /* Remove default day top styling */
        .fc .fc-daygrid-day-top {
          display: block;
        }
        
        /* Ensure day number is visible */
        .fc-daygrid-day-number {
          padding: 4px;
        }
        
        /* Make cells hoverable */
        .fc-daygrid-day:hover {
          background-color: rgba(99, 102, 241, 0.05) !important;
        }
        
        /* Style for today */
        .fc-day-today {
          background-color: rgba(99, 102, 241, 0.1) !important;
        }
        
        /* Hide default event content */
        .fc-event {
          display: none;
        }
      `}</style>
      <FullCalendar
      
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
        height="100%"
        events={calendarEvents}
        dateClick={(info) => {
          console.log("📅 Date clicked:", info.dateStr);
          if (onDateSelect) {
            onDateSelect(new Date(info.dateStr));
          }
        }}
        dayCellContent={renderDayCellContent}
        eventContent={() => null} // Hide default event rendering
      />
    </div>
  );
}



//suddenly harayo emoji for this wala
// import React, { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";

// export default function Calendar({ onDateSelect, moodData }) {
//   const [calendarEvents, setCalendarEvents] = useState([]);

//   useEffect(() => {
//     if (!moodData || moodData.length === 0) {
//       setCalendarEvents([]);
//       return;
//     }

//     const events = moodData.flatMap(entry => {
//       const entryDate = new Date(entry.date);
//       const y = entryDate.getFullYear();
//       const m = String(entryDate.getMonth() + 1).padStart(2, "0");
//       const d = String(entryDate.getDate()).padStart(2, "0");
//       const dateStr = `${y}-${m}-${d}`;

//       const arr = [];

//       if (entry.morning) {
//         arr.push({
//           id: `morning-${dateStr}`,
//           date: dateStr,
//           display: "background",
//           extendedProps: {
//             type: "morning",
//             emoji: entry.morning.emoji,
//             label: entry.morning.label,
//           },
//         });
//       }

//       if (entry.evening) {
//         arr.push({
//           id: `evening-${dateStr}`,
//           date: dateStr,
//           display: "background",
//           extendedProps: {
//             type: "evening",
//             emoji: entry.evening.emoji,
//             label: entry.evening.label,
//           },
//         });
//       }

//       return arr;
//     });

//     setCalendarEvents(events);
//   }, [moodData]);

//   // -----------------------------
//   // 🎯 KEY FIX — INJECT EMOJI INTO CELL AFTER IT MOUNTS
//   // -----------------------------
//   const handleDayCellMount = (arg) => {
//   // 🔥 Remove previous emoji wrappers to avoid duplicates
//   const old = arg.el.querySelector(".emoji-wrapper");
//   if (old) old.remove();

//   const cellDate = arg.date;
//   const y = cellDate.getFullYear();
//   const m = String(cellDate.getMonth() + 1).padStart(2, "0");
//   const d = String(cellDate.getDate()).padStart(2, "0");
//   const dateStr = `${y}-${m}-${d}`;

//   const dayEntry = moodData?.find(entry => {
//     const ed = new Date(entry.date);
//     const ey = ed.getFullYear();
//     const em = String(ed.getMonth() + 1).padStart(2, "0");
//     const edd = String(ed.getDate()).padStart(2, "0");
//     return `${ey}-${em}-${edd}` === dateStr;
//   });

//   if (!dayEntry || (!dayEntry.morning && !dayEntry.evening)) return;

//   // Create emoji container
//   const wrapper = document.createElement("div");
//   wrapper.classList.add("emoji-wrapper"); // ⭐ Add this
//   wrapper.style.position = "absolute";
//   wrapper.style.bottom = "4px";
//   wrapper.style.left = "0";
//   wrapper.style.right = "0";
//   wrapper.style.display = "flex";
//   wrapper.style.justifyContent = "center";
//   wrapper.style.gap = "8px";
//   wrapper.style.pointerEvents = "none";

//   if (dayEntry.morning) {
//     const img = document.createElement("img");
//     img.src = dayEntry.morning.emoji;
//     img.style.width = "28px";
//     img.style.height = "28px";
//     wrapper.appendChild(img);
//   }

//   if (dayEntry.evening) {
//     const img = document.createElement("img");
//     img.src = dayEntry.evening.emoji;
//     img.style.width = "28px";
//     img.style.height = "28px";
//     wrapper.appendChild(img);
//   }

//   arg.el.style.position = "relative";
//   arg.el.appendChild(wrapper);
// };


//   return (
//     <div className="p-6 w-[600px] h-[600px] rounded-xl shadow-md overflow-auto bg-[#FCF8F5]">

//       <style>{`
//         .fc-daygrid-day-frame {
//           min-height: 100px !important;
//         }
//         .fc-event {
//           display: none !important;
//         }
//       `}</style>

//       <FullCalendar
//         plugins={[dayGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         headerToolbar={{
//           left: "prev,next today",
//           center: "title",
//           right: "",
//         }}
//         height="auto"
//   contentHeight={550}
//         events={calendarEvents}
//         dateClick={(info) => onDateSelect?.(new Date(info.dateStr))}
//         eventContent={() => null}
//         dayCellDidMount={handleDayCellMount}  
//       />
//     </div>
//   );
// }
