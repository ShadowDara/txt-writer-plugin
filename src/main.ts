import {
	FileView,
	Plugin,
	TFile,
	WorkspaceLeaf
} from "obsidian";

const TXT_VIEW_TYPE = "txt-viewer";

class TxtView extends FileView {
	private textEl: HTMLTextAreaElement | null = null;

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
	if (!this.textEl) return;

	const text = await this.app.vault.read(file);
	this.textEl.value = text;
}

// on 
async onOpen(): Promise<void> {
	console.log("TxtView onOpen");

	this.contentEl.empty();

	this.textEl = this.contentEl.createEl("textarea");
	this.textEl.style.width = "100%";
	this.textEl.style.height = "100%";

	this.textEl.addEventListener("input", async () => {
		if (!this.file) return;
		await this.app.vault.modify(this.file, this.textEl!.value);
	});
}

async onLoadFile(file: TFile): Promise<void> {
	console.log("onLoadFile", file.path);
	await this.renderFile(file);
}
}

export default class TxtViewerPlugin extends Plugin {
	async onload(): Promise<void> {
		console.log("TXT Viewer geladen");
		
		//console.log("Aktiver TxtView:", this.app.workspace.getActiveViewOfType(TxtView));

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