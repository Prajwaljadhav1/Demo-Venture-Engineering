#!/usr/bin/env sh
set -eu

rm -rf dist
mkdir -p dist
cp index.html about.html services.html projects.html contact.html styles.css script.js boot.js dist/
mkdir -p dist/assets
cp assets/home-construction-background.jpg dist/assets/
cp assets/services-technical-background.jpg dist/assets/
cp assets/projects-technical-background.jpg dist/assets/
