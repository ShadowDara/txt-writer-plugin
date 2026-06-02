import React from "react";
import { layoutTimeline } from "./timeline";
import { Timeline } from "./types";

interface Props {
  data: Timeline;
  width?: number;
  rowHeight?: number;
}

export function TimelineSVG({ data, width = 800, rowHeight = 30 }: Props) {
  const items = layoutTimeline(data.entries, width, 300);

  return (
    <svg width={width} height={200}>
      {items.map((e, i) => (
        <g key={i}>
          <rect
            x={e.x}
            y={e.row * rowHeight}
            width={e.width}
            height={20}
            fill="#4f46e5"
            rx={4}
          />
          <text
            x={e.x + 4}
            y={e.row * rowHeight + 14}
            fontSize={10}
            fill="white"
          >
            {e.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
