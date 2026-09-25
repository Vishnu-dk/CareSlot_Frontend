// src/utils/dates.js

export const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const fmtDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const fmtTime = (t) => {
  // Handle both "HH:mm" and Full ISO strings
  const timePart = t.includes('T') ? t.split('T')[1].substring(0, 5) : t;
  const [h, m] = String(timePart).split(":");
  const d = new Date(); 
  d.setHours(+h, +m, 0);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

// ✅ NEW HELPER: Convert "YYYY-MM-DD" + "HH:mm" to a proper ISO String with Local Offset
export const combineToISOWithOffset = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;
  
  // Create a date object from the parts
  const [year, month, day] = dateStr.split('-');
  const [hours, minutes] = timeStr.split(':');
  
  const localDate = new Date(year, month - 1, day, hours, minutes, 0);
  
  // Return ISO string including the timezone offset (e.g., "2026-09-25T11:30:00+05:30")
  return localDate.toISOString().replace('Z', ''); 
  // Note: Some backends prefer explicit offsets. 
  // Safer approach for Java Instant/OffsetDateTime:
  return format(localDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
};

// Import format from date-fns if available, or use this manual fallback:
const format = (date, pattern) => {
    const pad = (num) => num.toString().padStart(2, '0');
    const tzOffset = -date.getTimezoneOffset();
    const sign = tzOffset >= 0 ? '+' : '-';
    const absOffset = Math.abs(tzOffset);
    const offsetHour = pad(Math.floor(absOffset / 60));
    const offsetMin = pad(absOffset % 60);
    
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${sign}${offsetHour}:${offsetMin}`;
};

export const nextDatesForWeekday = (backendDay, count = 4) => {
  const target = backendDay % 7; 
  const out = [];
  const base = new Date(); base.setHours(0, 0, 0, 0);
  for (let i = 1; i <= 60 && out.length < count; i++) {
    const cur = new Date(base); cur.setDate(base.getDate() + i);
    if (cur.getDay() === target) out.push(toISO(cur));
  }
  return out;
};