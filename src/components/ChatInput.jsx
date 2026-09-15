import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Send } from "lucide-react";
import { colors, type, radius, space } from "../styles/tokens.js";
import { hoverLift } from "../motion/presets.js";

// Owns its own text state so typing here only re-renders this small
// subtree — the rest of the page (skills, project cards, experience, etc.)
// no longer re-renders on every keystroke.
export function ChatInput({ onSend, loading, large, autoFocus, placeholder }) {
  const [value, setValue] = useState("");

  function submit() {
    const q = value.trim();
    if (!q || loading) return;
    onSend(q);
    setValue("");
  }

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: space.sm, background: colors.bgCard,
      border: `1px solid ${large ? colors.teal : colors.border}`, borderRadius: large ? radius.lg : radius.md,
      padding: large ? "8px 8px 8px 20px" : "6px 6px 6px 16px",
      boxShadow: large ? "0 8px 30px rgba(0,0,0,0.35)" : "none",
    }}>
      <Plus size={large ? 18 : 16} color={colors.slateMuted} aria-hidden="true" />
      <input
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={placeholder || "Ask about her projects, skills, or experience..."}
        aria-label="Ask the AI assistant a question"
        style={{ flex: 1, background: "none", border: "none", outline: "none", color: "white", fontSize: large ? type.lead : type.base, padding: large ? "14px 0" : "10px 0" }}
      />
      <motion.button
        onClick={submit}
        disabled={loading}
        aria-label="Send message"
        {...hoverLift}
        style={{
          width: large ? 42 : 34, height: large ? 42 : 34, borderRadius: large ? radius.lg : radius.md, background: colors.amber, border: "none",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0,
        }}>
        <Send size={large ? 18 : 15} color={colors.bg} aria-hidden="true" />
      </motion.button>
    </div>
  );
}
