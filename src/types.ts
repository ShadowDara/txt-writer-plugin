// Data Types for the Plugin

// Entry for the Timeline
export interface TimelineEntry {
  name: string;
  start: string;
  end: string;
}

// Data Structure for the Timeline
// They will be stored same as Excalidraw images, base64 of the JSON Data inside a Markdown file
export interface Timeline {
  magic: string;
  version: number;
  entries: TimelineEntry[];
}
