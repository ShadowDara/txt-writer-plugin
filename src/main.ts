import { Plugin, Notice, Modal, App, ButtonComponent, TextComponent } from "obsidian";
import { TimelineView, TIMELINE_VIEW_TYPE } from "./TimelineView";
import { TimelineCreatorModal } from "./TimelineModal";

export default class TimelinePlugin extends Plugin {
  async onload() {
    this.registerView(
      TIMELINE_VIEW_TYPE,
      (leaf) => new TimelineView(leaf)
    );

    // Register extension for .timeline.md files
    this.registerExtensions(["timeline.md"], TIMELINE_VIEW_TYPE);

    // Add ribbon icon to create timeline
    this.addRibbonIcon("calendar", "Create timeline", () => {
      this.createTimelineFlow();
    });

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
        const leaf = this.app.workspace.getRightLeaf(false);
        if (!leaf) {
          new Notice("Could not open timeline view.");
          return;
        }

        await leaf.setViewState({
          type: TIMELINE_VIEW_TYPE,
          active: true,
        });
      },
    });
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
          
          const leaf = this.app.workspace.getLeaf();
          await leaf.openFile(file);
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
