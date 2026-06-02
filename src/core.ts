// Core Logic

import { Timeline } from "./types";

import LZString from "lz-string";

const TIMELINE_VERSION = 1;
const MAGIC = "TIMELINE_V1_Shadowdara";

// Encode the Timeline
export function safeEncodeTimeline(timeline: Omit<Timeline, "version">): string {
  const fullData: Timeline = {
    magic: MAGIC,
    version: TIMELINE_VERSION,
    entries: timeline.entries ?? [],
  };

  const json = JSON.stringify(fullData);

  const compressed = LZString.compressToBase64(json);

  if (!compressed) {
    throw new Error("Timeline encoding failed (compression returned empty)");
  }

  return compressed;
}

// Decode the Timeline
export function safeDecodeTimeline(data: string): Timeline {
  if (!data || typeof data !== "string") {
    throw new Error("Invalid timeline data");
  }

  const decompressed = LZString.decompressFromBase64(data);

  if (!decompressed) {
    throw new Error("Decompression failed (invalid base64 or corrupted data)");
  }

  let parsed: any;

  try {
    parsed = JSON.parse(decompressed);
  } catch (e) {
    throw new Error("Invalid JSON after decompression");
  }
  
  assertTimeline(parsed);

  // Basic validation / fallback
  if (!parsed.entries || !Array.isArray(parsed.entries)) {
    throw new Error("Invalid timeline structure");
  }

  return {
    magic: parsed.magic,
    version: parsed.version ?? 1,
    entries: parsed.entries,
  };
}

// Put Timeline inside Markdown
export function wrapTimelineMarkdown(base64: string): string {
  return `\`\`\`timeline
${base64}
\`\`\``;
}

// Extract the Timeline from Markdown
export function extractTimelineFromMarkdown(md: string): string | null {
  const match = md.match(/```timeline([\s\S]*?)```/);
  if (!match?.[1]) return null;

  return match[1].trim();
}

// Function to assert the Timeline
function assertTimeline(obj: any): asserts obj is Timeline {
  if (!obj || obj.magic !== MAGIC) {
    throw new Error("Invalid timeline format");
  }
}

/*

Load 

const base64 = safeEncodeTimeline(timeline);
const markdown = wrapTimelineMarkdown(base64);

Safe 

const base64 = extractTimelineFromMarkdown(markdown);
if (!base64) throw new Error("No timeline found");

const timeline = safeDecodeTimeline(base64);

*/
