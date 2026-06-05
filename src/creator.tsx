import React, { useEffect, useState } from "react";
import { TimelineEntry } from "./types";
import { safeEncodeTimeline, wrapTimelineMarkdown } from "./core";
import { normalizeTimelineEntries } from "./timeline";

interface TimelineCreatorProps {
  initialEntries?: TimelineEntry[];
  onExport: (md: string) => void;
}

export function TimelineCreator({ initialEntries = [], onExport }: TimelineCreatorProps) {
  const [entries, setEntries] = useState<TimelineEntry[]>(() => normalizeTimelineEntries(initialEntries));

  useEffect(() => {
    setEntries(normalizeTimelineEntries(initialEntries));
  }, [initialEntries]);

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
    try {
      const base64 = safeEncodeTimeline({ entries: normalizeTimelineEntries(entries), magic: "TIMELINE_V1_Shadowdara" });
      const markdown = wrapTimelineMarkdown(base64);
      onExport(markdown);
    } catch (error: unknown) {
      console.error("Failed to export timeline:", error);
    }
  };

  return (
    <div style={{ padding: 16, fontFamily: "var(--font-family)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>Timeline Creator</h3>
        <div>
          <button onClick={addEntry} style={{ marginRight: 8, padding: "6px 12px", cursor: "pointer" }}>
            + Add Entry
          </button>
          <button onClick={exportTimeline} style={{ padding: "6px 12px", cursor: "pointer", backgroundColor: "#4f46e5", color: "white", border: "none", borderRadius: 4 }}>
            Export
          </button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        {entries.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>No entries yet. Click "+ Add Entry" to get started!</p>
        ) : (
          entries.map((e, i) => (
            <div key={i} style={{ marginBottom: 16, padding: 12, backgroundColor: "var(--background-secondary)", borderRadius: 4, border: "1px solid var(--divider-color)" }}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ display: "block", marginBottom: 4, fontSize: "0.9em", color: "var(--text-muted)" }}>Event Name</label>
                <input
                  value={e.name}
                  onChange={(ev) => updateEntry(i, "name", ev.target.value)}
                  placeholder="E.g., Project Launch"
                  style={{ width: "100%", padding: 6, boxSizing: "border-box", marginBottom: 8 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                <div>
                  <label style={{ display: "block", marginBottom: 4, fontSize: "0.9em", color: "var(--text-muted)" }}>Start Date</label>
                  <input
                    type="datetime-local"
                    value={e.start.slice(0, 16)}
                    onChange={(ev) =>
                      updateEntry(i, "start", new Date(ev.target.value).toISOString())
                    }
                    style={{ width: "100%", padding: 6, boxSizing: "border-box", paddingLeft: 27 }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 4, fontSize: "0.9em", color: "var(--text-muted)" }}>End Date</label>
                  <input
                    type="datetime-local"
                    value={e.end.slice(0, 16)}
                    onChange={(ev) =>
                      updateEntry(i, "end", new Date(ev.target.value).toISOString())
                    }
                    style={{ width: "100%", padding: 6, boxSizing: "border-box", paddingLeft: 27 }}
                  />
                </div>
              </div>

              <button 
                onClick={() => removeEntry(i)}
                style={{ padding: "6px 12px", cursor: "pointer", color: "#e74c3c" }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
