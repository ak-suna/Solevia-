import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function Calendar({ onDateSelect, moodData, journals = [], habitHistory = [] }) {
  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    console.log(" Calendar received moodData:", moodData);

    if (!moodData || moodData.length === 0) {
      setCalendarEvents([]);
      return;
    }

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

    console.log(" Created events:", events);
    setCalendarEvents(events);
  }, [moodData]);

  const renderDayCellContent = (arg) => {
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

    const hasJournal = journals.some(j => {
      const journalDate = new Date(j.date);
      const journalYear = journalDate.getFullYear();
      const journalMonth = String(journalDate.getMonth() + 1).padStart(2, '0');
      const journalDay = String(journalDate.getDate()).padStart(2, '0');
      return `${journalYear}-${journalMonth}-${journalDay}` === dateStr;
    });

    const habitEntry = habitHistory.find(h => {
      const habitDate = new Date(h.date);
      const habitYear = habitDate.getFullYear();
      const habitMonth = String(habitDate.getMonth() + 1).padStart(2, '0');
      const habitDay = String(habitDate.getDate()).padStart(2, '0');
      return `${habitYear}-${habitMonth}-${habitDay}` === dateStr;
    });

    return (
      <div className="relative w-full h-full p-1"
        style={{ fontFamily: "Brasika" }}>
        <div className="text-sm font-medium text-gray-700 mb-1">
          {arg.dayNumberText}
        </div>

        {/* Small indicators for journals/habits */}
        <div className="flex gap-1 mt-1 absolute bottom-1 left-1/2 transform -translate-x-1/2">
          {hasJournal && <div className="w-1.5 h-1.5 rounded-full bg-[#f4873e]" title="Journal entry" />}
          {habitEntry && habitEntry.completedCount > 0 && (
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" title="Habits completed" />
          )}
        </div>

        {dayMoods && (dayMoods.morning || dayMoods.evening) && (
          <div className="absolute bottom left-0 right-0 flex justify-center items-center gap-2.5 px-1 top-[50px]">
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
        .fc-daygrid-day-frame > div {
          position: relative !important;
        }

        .fc-daygrid-day-frame {
          min-height: 100px !important;
          position: relative;
          cursor: pointer;
        }
        
        .fc .fc-daygrid-day-top {
          display: block;
        }
        
        .fc-daygrid-day-number {
          padding: 4px;
        }
        
        .fc-daygrid-day:hover {
          background-color: rgba(99, 102, 241, 0.05) !important;
        }
        
        .fc-day-today {
          background-color: rgba(99, 102, 241, 0.1) !important;
        }
        
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
          console.log(" Date clicked:", info.dateStr);
          if (onDateSelect) {
            onDateSelect(new Date(info.dateStr));
          }
        }}
        dayCellContent={renderDayCellContent}
        eventContent={() => null}
      />
    </div>
  );
}