export const isToday = (date) => {
  const d = new Date(date);
  const today = new Date();
  return d.getDate() === today.getDate() &&
         d.getMonth() === today.getMonth() &&
         d.getFullYear() === today.getFullYear();
};

export const toDateString = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getLogKey = (date) => `dm_log_${toDateString(date)}`;
export const getWaterKey = (date) => `dm_water_${toDateString(date)}`;

export const formatDateDisplay = (date) => {
  const d = new Date(date);
  if (isToday(d)) return "Hari ini";
  return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'short' }).format(d);
};

export const formatDateShort = (date) => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(d);
};

export const getDayLabel = (date) => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(d);
};

export const getWeekDates = (anchor) => {
  const date = new Date(anchor);
  const day = date.getDay();
  // Adjust so Monday is the first day of the week
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  
  const week = [];
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(monday);
    nextDay.setDate(monday.getDate() + i);
    week.push(nextDay);
  }
  return week;
};
