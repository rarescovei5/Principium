import { SetStateAction, useCallback, useState } from 'react';

// ────────────────────────────────────────────────────────────────
// PROP TYPES
// ────────────────────────────────────────────────────────────────

interface CalendarProps {
  className?: string;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<SetStateAction<Date>>;
}

// ────────────────────────────────────────────────────────────────
// CALENDAR COMPONENT
// ────────────────────────────────────────────────────────────────

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  className = '',
  setSelectedDate,
}) => {
  // State for the current month/year we’re displaying (initialized lazily)
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Today's date for highlighting purposes
  const today = new Date();

  // Generate a matrix of dates for the current month (including leading/trailing days)
  const calendarDates = generateCalendarDates(currentDate);

  // Helper function to split an array into chunks of a given size
  function chunkArray<T>(array: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
    );
  }

  // ────────────────────────────────────────────────
  // Handlers for navigating months using useCallback with functional updates
  // ────────────────────────────────────────────────

  // Navigate to the previous month without needing currentDate as a dependency.
  const goToPrevMonth = useCallback(() => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  }, []);

  // Navigate to the next month without needing currentDate as a dependency.
  const goToNextMonth = useCallback(() => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  }, []);

  return (
    <div
      className={
        'inline-flex bg-bg flex-col h-full text-white border border-border rounded-lg p-4 ' +
        className
      }
    >
      {/* Month/Year Title and Navigation Buttons */}
      <div className="flex justify-between items-center mb-4">
        <button
          className="w-10 h-10 border hover:bg-border transition-colors duration-150 border-border rounded-lg flex items-center justify-center cursor-pointer"
          onClick={goToPrevMonth}
        >
          <svg
            className="w-3 rotate-90"
            viewBox="0 0 8 4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.75078 3.90553L0.0950727 0.511126C0.0340446 0.454488 0 0.379241 0 0.300992C0 0.222744 0.0340446 0.147497 0.0950727 0.0908601L0.0992035 0.0872054C0.128789 0.0596535 0.1644 0.0377147 0.203871 0.022723C0.243343 0.0077312 0.285849 2.38419e-07 0.328804 2.38419e-07C0.371759 2.38419e-07 0.414265 0.0077312 0.453736 0.022723C0.493207 0.0377147 0.528819 0.0596535 0.558404 0.0872054L4.00069 3.28366L7.4416 0.0872054C7.47118 0.0596535 7.50679 0.0377147 7.54626 0.022723C7.58573 0.0077312 7.62824 2.38419e-07 7.6712 2.38419e-07C7.71415 2.38419e-07 7.75666 0.0077312 7.79613 0.022723C7.8356 0.0377147 7.87121 0.0596535 7.9008 0.0872054L7.90493 0.0908601C7.96596 0.147497 8 0.222744 8 0.300992C8 0.379241 7.96596 0.454488 7.90493 0.511126L4.24922 3.90553C4.21707 3.93538 4.17841 3.95915 4.13557 3.97539C4.09273 3.99163 4.04661 4 4 4C3.95339 4 3.90727 3.99163 3.86443 3.97539C3.82159 3.95915 3.78293 3.93538 3.75078 3.90553Z"
              fill="white"
            />
          </svg>
        </button>
        <div className="p font-medium text-center">
          {currentDate.toLocaleString('default', { month: 'long' })}{' '}
          {currentDate.getFullYear()}
        </div>
        <button
          className="w-10 h-10 border hover:bg-border transition-colors duration-150 border-border rounded-lg flex items-center justify-center cursor-pointer"
          onClick={goToNextMonth}
        >
          <svg
            className="w-3 -rotate-90"
            viewBox="0 0 8 4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.75078 3.90553L0.0950727 0.511126C0.0340446 0.454488 0 0.379241 0 0.300992C0 0.222744 0.0340446 0.147497 0.0950727 0.0908601L0.0992035 0.0872054C0.128789 0.0596535 0.1644 0.0377147 0.203871 0.022723C0.243343 0.0077312 0.285849 2.38419e-07 0.328804 2.38419e-07C0.371759 2.38419e-07 0.414265 0.0077312 0.453736 0.022723C0.493207 0.0377147 0.528819 0.0596535 0.558404 0.0872054L4.00069 3.28366L7.4416 0.0872054C7.47118 0.0596535 7.50679 0.0377147 7.54626 0.022723C7.58573 0.0077312 7.62824 2.38419e-07 7.6712 2.38419e-07C7.71415 2.38419e-07 7.75666 0.0077312 7.79613 0.022723C7.8356 0.0377147 7.87121 0.0596535 7.9008 0.0872054L7.90493 0.0908601C7.96596 0.147497 8 0.222744 8 0.300992C8 0.379241 7.96596 0.454488 7.90493 0.511126L4.24922 3.90553C4.21707 3.93538 4.17841 3.95915 4.13557 3.97539C4.09273 3.99163 4.04661 4 4 4C3.95339 4 3.90727 3.99163 3.86443 3.97539C3.82159 3.95915 3.78293 3.93538 3.75078 3.90553Z"
              fill="white"
            />
          </svg>
        </button>
      </div>

      <table>
        <thead className="text-subtext">
          <tr className="grid grid-cols-7">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <th
                className="w-10 h-10 p flex items-center justify-center"
                key={day}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chunkArray(calendarDates, 7).map((week, weekIdx) => (
            <tr className="grid grid-cols-7" key={weekIdx}>
              {week.map((day, dayIdx) => {
                const isCurrentMonth =
                  day.getMonth() === currentDate.getMonth() &&
                  day.getFullYear() === currentDate.getFullYear();
                const isToday = isSameDay(day, today);
                const isSelected = isSameDay(selectedDate, day);

                return (
                  <td
                    key={dayIdx}
                    className={`w-10 h-10 flex items-center justify-center cursor-pointer rounded-lg transition-colors duration-150 ${
                      isSelected
                        ? 'bg-white text-bg'
                        : isToday
                        ? 'bg-surface'
                        : !isCurrentMonth
                        ? 'text-subtext'
                        : 'hover:bg-surface/50'
                    }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    {day.getDate()}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;

// ────────────────────────────────────────────────────────────────────
// Utility Functions
// ────────────────────────────────────────────────────────────────────

/**
 * Checks if two Date objects represent the same calendar day.
 */
function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * generateCalendarDates:
 * Generates an array of Date objects representing the days
 * in the current month plus leading/trailing days to fill out a 6-row grid.
 */
function generateCalendarDates(baseDate: Date): Date[] {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  // Start at the first day of the month
  const firstOfMonth = new Date(year, month, 1);
  // End at the last day of the month
  const lastOfMonth = new Date(year, month + 1, 0);

  // Determine the day of week for the first and last day
  const startDay = firstOfMonth.getDay();
  const endDay = lastOfMonth.getDay();

  const daysInMonth = lastOfMonth.getDate();
  const daysFromPrevMonth = startDay;
  const daysFromNextMonth = 6 - endDay;

  const calendarDays: Date[] = [];

  // Add days from previous month
  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    calendarDays.push(new Date(year, month, 1 - i - 1));
  }

  // Add current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(year, month, i));
  }

  // Add days from next month
  for (let i = 1; i <= daysFromNextMonth; i++) {
    calendarDays.push(new Date(year, month + 1, i));
  }

  return calendarDays;
}
