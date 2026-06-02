import { ItemView, WorkspaceLeaf } from "obsidian";
import React from "react";
import { createRoot, Root } from "react-dom/client";

import { TimelineSVG } from "./render";
import { TimelineCreator } from "./creator";
import { safeDecodeTimeline, extractTimelineFromMarkdown } from "./core";

export const TIMELINE_VIEW_TYPE = "timeline-view";

export class TimelineView extends ItemView {
  root: Root | null = null;
  data: any = null;
  mode: "view" | "edit" = "view";

  getViewType() {
    return TIMELINE_VIEW_TYPE;
  }

  getDisplayText() {
    return "Timeline";
  }

  async onOpen() {
    const container = this.containerEl.children[1] as HTMLElement;

if (!container) return;

this.root = createRoot(container);

    await this.loadDataFromFile();
    this.render();
  }

  async loadDataFromFile() {
    const file = this.app.workspace.getActiveFile();
    if (!file) return;

    const content = await this.app.vault.read(file);

    const base64 = extractTimelineFromMarkdown(content);
    if (!base64) return;

    this.data = safeDecodeTimeline(base64);
  }

  render() {
    if (!this.root) return;

    this.root.render(
      <div>
        <button onClick={() => {
          this.mode = this.mode === "view" ? "edit" : "view";
          this.render();
        }}>
          Toggle Mode
        </button>

        {this.mode === "view" ? (
          <TimelineSVG data={this.data} />
        ) : (
          <TimelineCreator
            onExport={async (md) => {
              const file = this.app.workspace.getActiveFile();
              if (!file) return;

              await this.app.vault.modify(file, md);
              await this.loadDataFromFile();
              this.render();
            }}
          />
        )}
      </div>
    );
  }

  async onClose() {
    this.root?.unmount();
  }
}
