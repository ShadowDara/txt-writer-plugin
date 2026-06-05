import React from "react";
import { layoutTimeline } from "./timeline";
import { Timeline } from "./types";

interface Props {
  data: Timeline | null;
  width?: number;
  rowHeight?: number;
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "Invalid date";
  }
}

export function TimelineSVG({ data, width = 800, rowHeight = 40 }: Props) {
  if (!data || !data.entries || data.entries.length === 0) {
    return (
      <div style={{ padding: 16, textAlign: "center", color: "var(--text-muted)" }}>
        No timeline data. Create one using the edit mode.
      </div>
    );
  }

  const items = layoutTimeline(data.entries, width, 300);
  const totalHeight = (Math.max(...items.map(i => i.row), 0) + 1) * rowHeight + 80;

  return (
    <div style={{ overflowX: "auto", padding: 16 }}>
      <svg width={width} height={Math.max(300, totalHeight)} style={{ backgroundColor: "var(--background-primary)" }}>
        {/* Axis line */}
        <line x1={50} y1={40} x2={width - 20} y2={40} stroke="var(--divider-color)" strokeWidth={2} />
        
        {/* Timeline entries */}
        {items.map((e, i) => {
          const startDate = formatDate(e.start);
          const endDate = formatDate(e.end);
          const y = 60 + e.row * rowHeight;
          
          return (
            <g key={i}>
              {/* Entry bar */}
              <rect
                x={e.x + 50}
                y={y}
                width={Math.max(e.width, 60)}
                height={24}
                fill="#4f46e5"
                rx={4}
                opacity={0.8}
              />
              
              {/* Entry label */}
              <text
                x={e.x + 50 + Math.max(e.width, 60) / 2}
                y={y + 16}
                textAnchor="middle"
                fontSize={11}
                fill="white"
                fontWeight="500"
              >
                {e.name.substring(0, 15)}{e.name.length > 15 ? "..." : ""}
              </text>
              
              {/* Date tooltip on hover */}
              <title>{`${e.name}: ${startDate} - ${endDate}`}</title>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
