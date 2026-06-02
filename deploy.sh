#!/bin/sh

PLUGIN_DIR="/storage/emulated/0/Documents/Dev/.obsidian/plugins/sample-plugin"

mkdir -p "$PLUGIN_DIR"

cp main.js "$PLUGIN_DIR/"
cp manifest.json "$PLUGIN_DIR/"

if [ -f styles.css ]; then
    cp styles.css "$PLUGIN_DIR/"
fi

echo "Plugin exportiert nach:"
echo "$PLUGIN_DIR"

