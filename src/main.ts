import {
	App,
	FileView,
	TFile,
	WorkspaceLeaf,
	Plugin
} from "obsidian";

const TXT_VIEW_TYPE = "txt-viewer";

class TxtView extends FileView {
	contentEl!: HTMLPreElement;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return TXT_VIEW_TYPE;
	}

	getDisplayText(): string {
		return this.file?.name ?? "TXT";
	}

	async onOpen() {
		const container = this.containerEl.children[1] as HTMLElement;

		if (!container) return;

		container.empty();

		this.contentEl = container.createEl("pre", {
			cls: "txt-viewer-content"
		});

		if (this.file) {
			await this.loadFile(this.file);
		}
	}

	async onFileOpen(file: TFile | null) {
		if (file) await this.loadFile(file);
	}

	private async loadFile(file: TFile) {
		const text = await this.app.vault.read(file);
		this.contentEl.textContent = text;
	}
}

export default class TxtViewerPlugin extends Plugin {
	onload() {
		this.registerView(TXT_VIEW_TYPE, (leaf: WorkspaceLeaf) => {
			return new TxtView(leaf);
		});

		this.registerExtensions(["txt"], TXT_VIEW_TYPE);
	}
	
	onunload() {
		this.app.workspace.getLeavesOfType(TXT_VIEW_TYPE).forEach(l => l.detach());
	}
}