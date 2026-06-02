import {
	FileView,
	Plugin,
	TFile,
	WorkspaceLeaf
} from "obsidian";

const TXT_VIEW_TYPE = "txt-viewer";

class TxtView extends FileView {
	private textEl: HTMLPreElement | null = null;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return TXT_VIEW_TYPE;
	}

	getDisplayText(): string {
		return this.file?.name ?? "Text";
	}
	
	// Render File
	private async renderFile(file: TFile): Promise<void> {
console.log("renderFile", file.path);
	  
	if (!this.textEl) {
		console.log("textEl fehlt");
		return;
	}

	const exists = this.app.vault.getAbstractFileByPath(file.path);

	console.log("exists =", !!exists);

	const text = await this.app.vault.read(file);
	console.log("File Content: ", text);

	this.textEl.textContent = text;
}

// on 
async onOpen(): Promise<void> {
	console.log("TxtView onOpen");

	this.contentEl.empty();
	this.textEl = this.contentEl.createEl("pre");
}

async onLoadFile(file: TFile): Promise<void> {
	console.log("onLoadFile", file.path);
	await this.renderFile(file);
}
}

export default class TxtViewerPlugin extends Plugin {
	async onload(): Promise<void> {
		console.log("TXT Viewer geladen");
		
		console.log(
		"Aktiver TxtView:",
		this.app.workspace.getActiveViewOfType(TxtView)
	);

		this.registerView(
			TXT_VIEW_TYPE,
			(leaf) => new TxtView(leaf)
		);

		this.registerExtensions(
			["txt"],
			TXT_VIEW_TYPE
		);
		
		this.registerEvent(
			this.app.workspace.on("file-open", (file) => {
				console.log("Datei geöffnet:", file?.path);
				//console.log("Content: ", file?.content);

				console.log(
					"Aktiver TxtView:",
					this.app.workspace.getActiveViewOfType(TxtView)
				);
			})
		);
	}

	async onunload(): Promise<void> {
		this.app.workspace
			.getLeavesOfType(TXT_VIEW_TYPE)
			.forEach((leaf) => leaf.detach());
	}
}