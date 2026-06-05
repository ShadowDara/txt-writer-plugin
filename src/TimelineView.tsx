import { ItemView, Notice, WorkspaceLeaf, TFile } from "obsidian";
import React from "react";
import { createRoot, Root } from "react-dom/client";

import { TimelineSVG } from "./render";
import { TimelineCreator } from "./creator";
import { safeDecodeTimeline, extractTimelineFromMarkdown } from "./core";
import { Timeline } from "./types";

export const TIMELINE_VIEW_TYPE = "timeline-view";

export class TimelineView extends ItemView {
  root: Root | null = null;
  data: Timeline | null = null;
  mode: "view" | "edit" = "view";
  file: TFile | null = null;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return TIMELINE_VIEW_TYPE;
  }

  getDisplayText() {
    return this.file?.basename || "Timeline";
  }

  getIcon() {
    return "calendar";
  }

  async onLoadFile(file: TFile): Promise<void> {
    this.file = file;
    await this.loadDataFromFile();
    void this.render();
  }

  async onOpen() {
    this.root = createRoot(this.contentEl);

    // Get file from leaf if available
    if (!this.file && this.leaf.view) {
      const leafView = this.leaf.view as any;
      const leafFile = leafView.file as TFile | undefined;
      if (leafFile) {
        this.file = leafFile;
      }
    }

    // Load and render
    await this.loadDataFromFile();
    void this.render();

    // Listen for file changes
    this.registerEvent(
      this.app.vault.on("modify", async (file) => {
        if (file === this.file) {
          await this.loadDataFromFile();
          void this.render();
        }
      })
    );
  }

  async loadDataFromFile() {
    try {
      if (!this.file) {
        this.data = null;
        return;
      }

      const content = await this.app.vault.read(this.file);
      const base64 = extractTimelineFromMarkdown(content);
      
      if (!base64) {
        this.data = null;
        return;
      }

      this.data = safeDecodeTimeline(base64);
    } catch (error) {
      console.error("Error loading timeline data:", error);
      this.data = null;
    }
  }

  render() {
    if (!this.root) return;

    this.root.render(
      <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "var(--font-family)" }}>
        <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--divider-color)", display: "flex", gap: 8 }}>
          <button 
            onClick={() => {
              this.mode = this.mode === "view" ? "edit" : "view";
              void this.render();
            }}
            style={{
              padding: "6px 12px",
              cursor: "pointer",
              backgroundColor: this.mode === "view" ? "var(--background-modifier-active)" : "transparent",
              border: "1px solid var(--divider-color)",
              borderRadius: 4,
              color: "var(--text-normal)",
            }}
          >
            {this.mode === "view" ? "📊 View" : "✏️ Edit"}
          </button>
          {this.file && (
            <span style={{ fontSize: "0.9em", color: "var(--text-muted)", marginLeft: "auto", display: "flex", alignItems: "center" }}>
              {this.file.basename}
            </span>
          )}
        </div>

        <div style={{ flex: 1, overflow: "auto" }}>
          {this.mode === "view" ? (
            <TimelineSVG data={this.data} />
          ) : (
            <TimelineCreator
              onExport={(md) => {
                void (async () => {
                  try {
                    if (!this.file) {
                      new Notice("No timeline file loaded.");
                      return;
                    }

                    const content = await this.app.vault.read(this.file);
                    
                    // Remove existing timeline if present
                    const cleanContent = content.replace(/```timeline[\s\S]*?```\n?/g, "");
                    
                    // Append new timeline
                    const newContent = cleanContent + (cleanContent.endsWith("\n") ? "" : "\n") + md;
                    
                    await this.app.vault.modify(this.file, newContent);
                    await this.loadDataFromFile();
                    this.mode = "view";
                    void this.render();
                    new Notice("Timeline updated successfully!");
                  } catch (error) {
                    console.error("Error updating timeline:", error);
                    new Notice("Failed to update timeline. Check console for details.");
                  }
                })();
              }}
            />
          )}
        </div>
      </div>
    );
  }

  async onClose() {
    this.root?.unmount();
  }
}
