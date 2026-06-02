import { Timeline, TimelineEntry } from "./types";

type PositionedEntry = TimelineEntry & {
  x: number;
  width: number;
  row: number;
};

export function layoutTimeline(
  entries: TimelineEntry[],
  width: number,
  height: number
): PositionedEntry[] {
  const sorted = [...entries].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  const lanes: TimelineEntry[][] = [];
  const positioned: PositionedEntry[] = [];

  const minTime = Math.min(...sorted.map(e => +new Date(e.start)));
  const maxTime = Math.max(...sorted.map(e => +new Date(e.end)));

  const timeToX = (t: number) =>
    ((t - minTime) / (maxTime - minTime)) * width;

  for (const entry of sorted) {
    const start = +new Date(entry.start);
    const end = +new Date(entry.end);

    let row = lanes.findIndex(l =>
      l.every(e => new Date(e.end) <= new Date(entry.start))
    );

    if (row === -1) {
      lanes.push([entry]);
      row = lanes.length - 1;
    } else {
      lanes[row]!.push(entry);
    }

    positioned.push({
      ...entry,
      x: timeToX(start),
      width: Math.max(8, timeToX(end) - timeToX(start)),
      row,
    });
  }

  return positioned;
}
