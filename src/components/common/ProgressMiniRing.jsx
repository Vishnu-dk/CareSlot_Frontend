export default function ProgressMiniRing({ value = 0 }) {
  const size = 50;
  const sw = 5;

  const r = (size - sw * 2) / 2;
  const circ = 2 * Math.PI * r;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#D7CCC8"
        strokeWidth={sw}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#A07855"
        strokeWidth={sw}
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - value / 100)}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s ease" }}
      />
    </svg>
  );
}
