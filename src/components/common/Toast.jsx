import { useState } from "react";

export function useToastMsg() {
  const [message, setMessage] = useState(null);
  const show = (m) => {
    setMessage(m);
    setTimeout(() => setMessage(null), 3500);
  };
  return { message, show };
}

export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        background: "#3E2723",
        color: "white",
        padding: "12px 20px",
        borderRadius: 14,
        fontSize: 13.5,
        fontWeight: 500,
        zIndex: 400,
        boxShadow: "0 8px 32px rgba(62,39,35,0.25)",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span style={{ color: "#A07855" }}>✓</span> {message}
    </div>
  );
}
