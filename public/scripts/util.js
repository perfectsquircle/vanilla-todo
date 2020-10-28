/* global VT */
window.VT = window.VT || {};

VT.uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
  return v.toString(16);
});

VT.formatDateId = date => {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  return `${y.toString().padStart(4, '0')}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
};

VT.formatDate = date => `${VT.formatMonth(date)} ${VT.formatDayOfMonth(date)} ${date.getFullYear().toString().padStart(4, '0')}`;

VT.formatDayOfMonth = date => {
  const d = date.getDate();
  const t = d % 10;

  return d === 11 || d === 12 || d === 13
    ? `${d}th`
    : t === 1
    ? `${d}st`
    : t === 2
    ? `${d}nd`
    : t === 3
    ? `${d}rd`
    : `${d}th`;
};

VT.DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

VT.formatDayOfWeek = date => VT.DAY_NAMES[date.getDay()];

VT.MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

VT.formatMonth = date => VT.MONTH_NAMES[date.getMonth()];
