import React, { useState } from "react";
import LZString from "lz-string";

export interface TimelineEntry {
  name: string;
  start: string;
  end: string;
}

export interface Timeline {
  version: number;
  entries: TimelineEntry[];
}

const EMPTY: Timeline = {
  version: 1,
  entries: [],
};

export function TimelineCreator({ onExport }: { onExport: (md: string) => void }) {
  const [entries, setEntries] = useState<TimelineEntry[]>(EMPTY.entries);

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        name: "New Event",
        start: new Date().toISOString(),
        end: new Date().toISOString(),
      },
    ]);
  };

  const updateEntry = (
  index: number,
  field: keyof TimelineEntry,
  value: string
) => {
  const copy = [...entries];

  copy[index] = {
    ...copy[index],
    [field]: value,
  } as TimelineEntry;

  setEntries(copy);
};

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const exportTimeline = () => {
    const data: Timeline = {
      version: 1,
      entries,
    };

    const json = JSON.stringify(data);
    const compressed = LZString.compressToBase64(json);

    const markdown = `\`\`\`timeline
${compressed}
\`\`\``;

    onExport(markdown);
  };

  return (
    <div style={{ padding: 12 }}>
      <h3>Timeline Creator</h3>

      <button onClick={addEntry}>+ Add Entry</button>
      <button onClick={exportTimeline} style={{ marginLeft: 8 }}>
        Export
      </button>

      <div style={{ marginTop: 12 }}>
        {entries.map((e, i) => (
          <div key={i} style={{ marginBottom: 8, borderBottom: "1px solid #333" }}>
            <input
              value={e.name}
              onChange={(ev) => updateEntry(i, "name", ev.target.value)}
              placeholder="Name"
            />

            <input
              type="datetime-local"
              value={e.start.slice(0, 16)}
              onChange={(ev) =>
                updateEntry(i, "start", new Date(ev.target.value).toISOString())
              }
            />

            <input
              type="datetime-local"
              value={e.end.slice(0, 16)}
              onChange={(ev) =>
                updateEntry(i, "end", new Date(ev.target.value).toISOString())
              }
            />

            <button onClick={() => removeEntry(i)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
