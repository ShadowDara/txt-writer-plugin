# Timelines Plugin for Obsidian

A powerful and intuitive timeline visualization plugin for Obsidian. Create, edit, and view beautiful timelines directly in your notes.

## Features

✨ **Visual Timeline Rendering** - Display events on an interactive timeline with automatic layout
📝 **Easy Entry Creation** - Add events with names, start dates, and end dates  
💾 **Markdown Integration** - Timelines are stored as base64-encoded data in markdown code blocks
🎨 **Dark Mode Support** - Automatically adapts to your Obsidian theme
🔄 **Toggle View/Edit** - Switch between viewing your timeline and editing entries
📊 **Smart Layout** - Automatically arranges overlapping events in multiple rows

## Installation

1. Open Obsidian Settings → Community Plugins
2. Search for "Timelines"
3. Click Install, then Enable

## Usage

### Creating a Timeline

1. Click the Calendar icon in the left ribbon, or use the command palette
2. In the Timeline view, click the **✏️ Edit** button
3. Click **+ Add Entry** to create new timeline entries
4. Fill in:
   - **Event Name**: Title of the event (e.g., "Project Launch")
   - **Start Date**: When the event begins
   - **End Date**: When the event ends
5. Click **Export** to save the timeline to your current note

### Viewing a Timeline

1. Once exported, click the **📊 View** button to see your timeline
2. The timeline displays all events in chronological order
3. Hover over events to see their exact dates

### Format

Timelines are stored in your markdown as:

```markdown
```timeline
<base64-encoded-compressed-timeline-data>
```
```

This format allows timelines to coexist with your other markdown content.

## Data Structure

Each timeline entry contains:
- `name`: Event name/title
- `start`: Start date (ISO 8601 format)
- `end`: End date (ISO 8601 format)

## Tips

- **Organize your notes**: Keep related timelines together
- **Use in tables**: Timelines work great alongside other note content
- **Multiple timelines**: You can have multiple timelines in one note
- **Date flexibility**: Use the date picker for precise date selection

## Known Limitations

- Timeline data is embedded in markdown files only
- Web clipper support may require additional configuration
- Mobile performance depends on timeline size

## Support

For issues, feature requests, or suggestions, please open an issue on GitHub.

## Changelog

### v1.0.0
- Initial release
- Core timeline rendering
- Entry creation and editing
- View/Edit mode toggle
- Markdown integration

- Make sure your NodeJS is at least v18 (`node --version`).
- `npm i` to install dependencies.
- `npm run dev` to start compilation in watch mode.

## Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.

## Improve code quality with eslint

- [ESLint](https://eslint.org/) is a tool that analyzes your code to quickly find problems. You can run ESLint against your plugin to find common bugs and ways to improve your code.
- This project already has eslint preconfigured, you can invoke a check by running`npm run lint`
- Together with a custom eslint [plugin](https://github.com/obsidianmd/eslint-plugin) for Obsidan specific code guidelines.
- A GitHub action is preconfigured to automatically lint every commit on all branches.

## Funding URL

You can include funding URLs where people who use your plugin can financially support it.

The simple way is to set the `fundingUrl` field to your link in your `manifest.json` file:

```json
{
	"fundingUrl": "https://buymeacoffee.com"
}
```

If you have multiple URLs, you can also do:

```json
{
	"fundingUrl": {
		"Buy Me a Coffee": "https://buymeacoffee.com",
		"GitHub Sponsor": "https://github.com/sponsors",
		"Patreon": "https://www.patreon.com/"
	}
}
```

## API Documentation

See https://docs.obsidian.md
