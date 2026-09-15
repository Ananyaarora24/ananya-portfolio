import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { colors, font, type, radius, space } from "../styles/tokens.js";
import { staggerContainer, staggerItem, DURATION } from "../motion/presets.js";

// Builds a small node/edge graph from the declarative architecture shape:
//   { lanes: [{ label?, steps[] }], merge?: [...], fanOut?: [...] }
// One or more parallel lanes (e.g. a vision path + a voice path) that can
// converge into a shared `merge` chain, or a single lane whose last node
// branches out into `fanOut` endpoints (e.g. auth/data/AI services).
function buildGraph(architecture) {
  const nodes = [];
  const edges = [];

  architecture.lanes.forEach((lane, li) => {
    lane.steps.forEach((label, si) => {
      const id = `lane${li}-${si}`;
      nodes.push({ id, label, lane: li });
      if (si > 0) edges.push({ id: `e-${id}`, from: `lane${li}-${si - 1}`, to: id });
    });
  });

  if (architecture.merge) {
    architecture.merge.forEach((label, i) => {
      const id = `merge-${i}`;
      nodes.push({ id, label, group: "merge" });
      if (i === 0) {
        architecture.lanes.forEach((lane, li) => {
          const from = `lane${li}-${lane.steps.length - 1}`;
          edges.push({ id: `e-merge-${li}`, from, to: id });
        });
      } else {
        edges.push({ id: `e-${id}`, from: `merge-${i - 1}`, to: id });
      }
    });
  }

  if (architecture.fanOut) {
    const lastLane = architecture.lanes.length - 1;
    const from = `lane${lastLane}-${architecture.lanes[lastLane].steps.length - 1}`;
    architecture.fanOut.forEach((label, i) => {
      const id = `fanout-${i}`;
      nodes.push({ id, label, group: "fanOut" });
      edges.push({ id: `e-${id}`, from, to: id });
    });
  }

  return { nodes, edges };
}

function Node({ id, label, hovered, onHover }) {
  const active = hovered.active.has(id);
  const dimmed = hovered.id && !active;
  return (
    <motion.span
      variants={staggerItem}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(id)}
      onBlur={() => onHover(null)}
      tabIndex={0}
      animate={{ opacity: dimmed ? 0.4 : 1 }}
      transition={{ duration: DURATION.fast }}
      style={{
        fontFamily: font.mono, fontSize: type.micro, color: active ? colors.bg : colors.slate,
        background: active ? colors.teal : colors.bg,
        border: `1px solid ${active ? colors.teal : colors.border}`, borderRadius: radius.sm,
        padding: "5px 9px", whiteSpace: "nowrap", cursor: "default", outline: "none",
      }}
    >
      {label}
    </motion.span>
  );
}

function Arrow({ edgeId, hovered }) {
  const active = hovered.activeEdges.has(edgeId);
  const dimmed = hovered.id && !active;
  return (
    <motion.span
      variants={staggerItem}
      animate={{ opacity: dimmed ? 0.25 : 1, color: active ? colors.teal : colors.amber }}
      transition={{ duration: DURATION.fast }}
      aria-hidden="true"
      className="arch-arrow"
      style={{ fontSize: type.small, flexShrink: 0 }}
    >
      →
    </motion.span>
  );
}

export function ArchDiagram({ architecture, flow }) {
  // Back-compat: a few lightweight (non-featured) entries may still pass a
  // flat `flow` array instead of the structured `architecture` shape.
  const arch = architecture || (flow?.length ? { lanes: [{ steps: flow }] } : null);
  const { nodes, edges } = useMemo(() => (arch ? buildGraph(arch) : { nodes: [], edges: [] }), [arch]);
  const [hoveredId, setHoveredId] = useState(null);

  const hovered = useMemo(() => {
    if (!hoveredId) return { id: null, active: new Set(), activeEdges: new Set() };
    const active = new Set([hoveredId]);
    const activeEdges = new Set();
    for (const e of edges) {
      if (e.from === hoveredId || e.to === hoveredId) {
        activeEdges.add(e.id);
        active.add(e.from);
        active.add(e.to);
      }
    }
    return { id: hoveredId, active, activeEdges };
  }, [hoveredId, edges]);

  if (!arch) return null;

  const laneEdgeMap = new Map(edges.map((e) => [e.to, e]));

  function renderChain(steps, lanePrefix) {
    return steps.map((label, i) => {
      const id = `${lanePrefix}-${i}`;
      const node = nodes.find((n) => n.id === id);
      const edge = laneEdgeMap.get(id);
      return (
        <span key={id} style={{ display: "flex", alignItems: "center", gap: space.xs }}>
          {i > 0 && edge && <Arrow edgeId={edge.id} hovered={hovered} />}
          {node && <Node id={id} label={node.label} hovered={hovered} onHover={setHoveredId} />}
        </span>
      );
    });
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      style={{ display: "flex", flexDirection: "column", gap: space.sm }}
    >
      {arch.lanes.map((lane, li) => (
        <div key={li} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {lane.label && (
            <span style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: 0.4, textTransform: "uppercase", color: colors.slateMuted }}>{lane.label}</span>
          )}
          <div className="arch-lane" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: space.xs }}>
            {renderChain(lane.steps, `lane${li}`)}
          </div>
        </div>
      ))}

      {arch.merge && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontFamily: font.mono, fontSize: 10, color: colors.slateMuted }} aria-hidden="true">↓ together</span>
          <div className="arch-lane" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: space.xs }}>
            {arch.merge.map((label, i) => {
              const id = `merge-${i}`;
              return (
                <span key={id} style={{ display: "flex", alignItems: "center", gap: space.xs }}>
                  {i > 0 && <Arrow edgeId={`e-${id}`} hovered={hovered} />}
                  <Node id={id} label={label} hovered={hovered} onHover={setHoveredId} />
                </span>
              );
            })}
          </div>
        </div>
      )}

      {arch.fanOut && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontFamily: font.mono, fontSize: 10, color: colors.slateMuted }} aria-hidden="true">↓ branches to</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: space.xs }}>
            {arch.fanOut.map((label, i) => (
              <Node key={`fanout-${i}`} id={`fanout-${i}`} label={label} hovered={hovered} onHover={setHoveredId} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
