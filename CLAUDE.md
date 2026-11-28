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
Use yarn (yarn.lock is the source of truth; do not use npm, it rewrites both lockfiles):
- `yarn install` - Install dependencies
- `yarn start` - Start development server (alias for docusaurus start)
- `yarn build` - Build static site
- `yarn serve` - Serve built site locally
- `yarn typecheck` - Run TypeScript type checking

### Docusaurus Commands
- `yarn docusaurus start` - Start dev server with hot reload
- `yarn docusaurus build` - Generate static content
- `yarn docusaurus clear` - Clear build cache
- `yarn docusaurus swizzle` - Customize theme components
- `yarn docusaurus deploy` - Deploy to GitHub Pages

### Deployment
- SSH: `USE_SSH=true yarn deploy`
- HTTPS: `GIT_USER=<username> yarn deploy`

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