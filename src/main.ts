import { App, ButtonComponent, MarkdownView, Menu, Modal, Notice, Plugin, TFile, TextComponent, WorkspaceLeaf } from "obsidian";
import { TimelineView, TIMELINE_VIEW_TYPE } from "./TimelineView";
import { TimelineCreatorModal } from "./TimelineModal";

export default class TimelinePlugin extends Plugin {
  private timelineOpenTimeout: number | null = null;

  async onload() {
    this.registerView(
      TIMELINE_VIEW_TYPE,
      (leaf) => new TimelineView(leaf)
    );

    // Add ribbon icon to create timeline
    this.addRibbonIcon("calendar", "Create timeline", () => {
      this.createTimelineFlow();
    });

    this.registerEvent(
      this.app.workspace.on("file-open", (file) => {
        if (file instanceof TFile && this.isTimelineFile(file)) {
          this.scheduleTimelineFileOpen(file);
        }
      })
    );

    this.register(() => {
      if (this.timelineOpenTimeout !== null) {
        window.clearTimeout(this.timelineOpenTimeout);
      }
    });

    this.registerEvent(
      this.app.workspace.on("file-menu", (menu: Menu, file) => {
        if (file instanceof TFile && this.isTimelineFile(file)) {
          menu.addItem((item) => {
            item
              .setTitle("Open as timeline")
              .setIcon("calendar")
              .onClick(() => {
                void this.openTimelineFile(file);
              });
          });
        }
      })
    );

    // Add command to create a new timeline
    this.addCommand({
      id: "create-timeline",
      name: "Create new timeline",
      callback: () => {
        this.createTimelineFlow();
      },
    });

    // Add command to open timeline view
    this.addCommand({
      id: "open-timeline-view",
      name: "Open timeline view",
      callback: async () => {
        const file = this.app.workspace.getActiveFile();

        if (!file) {
          new Notice("Open a timeline file first.");
          return;
        }

        if (!this.isTimelineFile(file)) {
          new Notice("The active file is not a timeline file.");
          return;
        }

        await this.openTimelineFile(file);
      },
    });
  }

  private isTimelineFile(file: TFile): boolean {
    return file.path.endsWith(".timeline.md");
  }

  private async openTimelineFile(file: TFile): Promise<void> {
    const leaf = this.app.workspace.getLeaf("tab");

    await this.openTimelineFileInLeaf(file, leaf);
  }

  private scheduleTimelineFileOpen(file: TFile): void {
    if (this.timelineOpenTimeout !== null) {
      window.clearTimeout(this.timelineOpenTimeout);
    }

    this.timelineOpenTimeout = window.setTimeout(() => {
      this.timelineOpenTimeout = null;
      void this.openTimelineFileInOpenedMarkdownLeaf(file);
    }, 50);
  }

  private async openTimelineFileInOpenedMarkdownLeaf(file: TFile): Promise<void> {
    const leaf = this.findOpenMarkdownLeaf(file) ?? this.app.workspace.getLeaf("tab");

    await this.openTimelineFileInLeaf(file, leaf);
  }

  private findOpenMarkdownLeaf(file: TFile): WorkspaceLeaf | null {
    let matchingLeaf: WorkspaceLeaf | null = null;

    this.app.workspace.iterateAllLeaves((leaf) => {
      if (matchingLeaf !== null) {
        return;
      }

      if (leaf.view instanceof MarkdownView && leaf.view.file?.path === file.path) {
        matchingLeaf = leaf;
      }
    });

    return matchingLeaf;
  }

  private async openTimelineFileInLeaf(file: TFile, leaf: WorkspaceLeaf): Promise<void> {
    if (leaf.view.getViewType() === TIMELINE_VIEW_TYPE) {
      return;
    }

    await leaf.setViewState({
      type: TIMELINE_VIEW_TYPE,
      state: {
        filePath: file.path,
      },
      active: true,
    });

    this.app.workspace.setActiveLeaf(leaf, { focus: true });
    await this.app.workspace.revealLeaf(leaf);
  }

  private createTimelineFlow(): void {
    const modal = new TimelineCreatorModal(this.app, (markdown: string) => {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      new TimelineNameModal(this.app, async (name) => {
        try {
          if (!name) {
            new Notice("Timeline creation cancelled.");
            return;
          }

          const fileName = `${name}.timeline.md`;
          const fileContent = `# ${name}\n\n${markdown}`;
          
          const file = await this.app.vault.create(fileName, fileContent);
          
          new Notice(`Timeline "${name}" created successfully!`);
          
          await this.openTimelineFile(file);
        } catch (error) {
          console.error("Error creating timeline:", error);
          new Notice("Failed to create timeline. Check console for details.");
        }
      }).open();
    });
    modal.open();
  }
}

class TimelineNameModal extends Modal {
  private inputValue = "";

  constructor(app: App, private onSubmit: (value: string) => void) {
    super(app);
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("timeline-name-modal");

    contentEl.createEl("h2", { text: "Enter timeline name" });

    const inputEl = new TextComponent(contentEl).setPlaceholder("Timeline name");
    inputEl.onChange((value) => {
      this.inputValue = value;
    });

    const buttonContainer = contentEl.createDiv("timeline-modal-buttons");

    new ButtonComponent(buttonContainer)
      .setButtonText("Create")
      .setCta()
      .onClick(() => {
        this.onSubmit(this.inputValue);
        this.close();
      });

    new ButtonComponent(buttonContainer)
      .setButtonText("Cancel")
      .onClick(() => {
        this.close();
      });

    inputEl.inputEl.focus();
  }
}
