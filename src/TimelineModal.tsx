import React from "react";
import { Modal, App } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { TimelineCreator } from "./creator";

export class TimelineCreatorModal extends Modal {
  root: Root | null = null;

  constructor(app: App, private onSave: (markdown: string) => void) {
    super(app);
    this.titleEl.textContent = "Create timeline";
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    this.root = createRoot(contentEl);
    this.root.render(
      <TimelineCreator
        onExport={(md) => {
          this.onSave(md);
          this.close();
        }}
      />
    );
  }

  onClose() {
    this.root?.unmount();
  }
}
