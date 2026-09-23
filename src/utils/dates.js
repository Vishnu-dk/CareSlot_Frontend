export const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const fmtDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const fmtTime = (t) => {
  const [h, m] = String(t).split(":");
  const d = new Date(); d.setHours(+h, +m, 0);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

// backend dayOfWeek (1=Mon..7=Sun) → next `count` real calendar dates
export const nextDatesForWeekday = (backendDay, count = 4) => {
  const target = backendDay % 7; // JS: 0=Sun
  const out = [];
  const base = new Date(); base.setHours(0, 0, 0, 0);
  for (let i = 1; i <= 60 && out.length < count; i++) {
    const cur = new Date(base); cur.setDate(base.getDate() + i);
    if (cur.getDay() === target) out.push(toISO(cur));
  }
  return out;
};