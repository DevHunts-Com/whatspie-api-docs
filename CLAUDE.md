# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Docusaurus-based documentation site for the Whatspie API, a WhatsApp messaging service. The repository is currently undergoing a refactor (v3 branch) and contains both new Docusaurus content and legacy API documentation.

## Architecture

- **Framework**: Docusaurus v3.8.1 with TypeScript
- **Content**: MDX-based documentation in `docs/` and `blog/`
- **Configuration**: Main config in `docusaurus.config.ts`
- **Styling**: Custom CSS in `src/css/custom.css`
- **Components**: React components in `src/components/`

## Common Development Commands

### Package Manager
Use npm (package-lock.json present):
- `npm install` - Install dependencies
- `npm start` - Start development server (alias for docusaurus start)
- `npm run build` - Build static site
- `npm run serve` - Serve built site locally
- `npm run typecheck` - Run TypeScript type checking

### Docusaurus Commands
- `npm run docusaurus start` - Start dev server with hot reload
- `npm run docusaurus build` - Generate static content
- `npm run docusaurus clear` - Clear build cache
- `npm run docusaurus swizzle` - Customize theme components
- `npm run docusaurus deploy` - Deploy to GitHub Pages

### Deployment
- SSH: `USE_SSH=true npm run deploy`
- HTTPS: `GIT_USER=<username> npm run deploy`

## Key Files and Structure

- `docusaurus.config.ts` - Main configuration file
- `sidebars.ts` - Sidebar navigation configuration (currently auto-generated)
- `package.json` - Dependencies and scripts
- `docs/` - Documentation pages (MDX format)
- `blog/` - Blog posts
- `src/pages/` - Custom pages
- `static/` - Static assets (images, favicons, etc.)
- `whatspie-node-collection.json` - Postman collection with WhatsApp API examples

## Development Notes

- TypeScript is enabled with Docusaurus TypeScript config
- Node.js >= 18.0 required
- The site uses auto-generated sidebars from folder structure
- Current branch `refactor/v3` suggests major restructuring in progress
- Many legacy files have been deleted in current working state

## Current State

The repository appears to be mid-refactor with many files deleted and new Docusaurus structure being established. Check git status before making changes as many files are staged for deletion.