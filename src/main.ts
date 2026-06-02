import { Plugin } from "obsidian";
import { TimelineView, TIMELINE_VIEW_TYPE } from "./TimelineView";

export default class TimelinePlugin extends Plugin {
  async onload() {
    this.registerView(
      TIMELINE_VIEW_TYPE,
      (leaf) => new TimelineView(leaf)
    );

    this.addRibbonIcon("calendar", "Open Timeline", async () => {
      const leaf = this.app.workspace.getRightLeaf(false);

if (!leaf) return;

await leaf.setViewState({
  type: TIMELINE_VIEW_TYPE,
  active: true,
});
    });
  }
}
