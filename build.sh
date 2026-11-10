#!/usr/bin/env sh
set -eu

rm -rf dist
mkdir -p dist
cp index.html about.html services.html projects.html contact.html styles.css script.js boot.js dist/
