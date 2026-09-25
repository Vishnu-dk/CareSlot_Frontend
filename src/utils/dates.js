export const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const localToUtcTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;

  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);

  const utcIso = new Date(
    year,
    month - 1,
    day,
    hours,
    minutes,
    0,
  ).toISOString();

  return utcIso.split("T")[1].split(".")[0];
};

export const localToUtcDate = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;

  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);

  const utcIso = new Date(
    year,
    month - 1,
    day,
    hours,
    minutes,
    0,
  ).toISOString();

  return utcIso.split("T")[0];
};

export const fmtDate = (isoString) => {
  if (!isoString) return "";

  const d = new Date(isoString);

  if (isNaN(d.getTime())) return isoString;

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const fmtTime = (isoString) => {
  if (!isoString) return "";

  let d;

  if (isoString.includes("T")) {
    d = new Date(isoString);
  } else {
    const [h, m] = String(isoString).split(":");
    d = new Date();
    d.setHours(+h, +m, 0);
  }

  if (isNaN(d.getTime())) return isoString;

  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

export const nextDatesForWeekday = (backendDay, count = 4) => {
  const targetJsDay = backendDay % 7;

  const out = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);

  for (let i = 0; i <= 60 && out.length < count; i++) {
    const cur = new Date(base);
    cur.setDate(base.getDate() + i);

    if (cur.getDay() === targetJsDay) {
      out.push(toISO(cur));
    }
  }

  return out;
};

export const combineToISOWithOffset = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;
  const [year, month, day] = dateStr.split("-");
  const [hours, minutes] = timeStr.split(":");
  const localDate = new Date(year, month - 1, day, hours, minutes, 0);

  const pad = (num) => num.toString().padStart(2, "0");
  const tzOffset = -localDate.getTimezoneOffset();
  const sign = tzOffset >= 0 ? "+" : "-";
  const absOffset = Math.abs(tzOffset);
  const offsetHour = pad(Math.floor(absOffset / 60));
  const offsetMin = pad(absOffset % 60);

  return `${localDate.getFullYear()}-${pad(localDate.getMonth() + 1)}-${pad(localDate.getDate())}T${pad(localDate.getHours())}:${pad(localDate.getMinutes())}:00${sign}${offsetHour}:${offsetMin}`;
};

export const isFutureSlot = (isoString) => {
  if (!isoString) return false;
  const slotDate = new Date(isoString);
  const now = new Date();
  return slotDate.getTime() > now.getTime();
};
