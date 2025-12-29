# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application using the App Router architecture with TypeScript, React 19, and Tailwind CSS v4. The project is configured with shadcn/ui components (New York style) for UI development.

## Development Commands

### Running the Application
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build production bundle
npm start            # Start production server
npm run lint         # Run ESLint
```

### Internationalization (i18n)
```bash
npm run i18n:extract # Extract translatable messages from source code
npm run i18n:compile # Compile message catalogs for production
```

## Architecture

### Directory Structure
- `src/` - Source code directory
  - `src/app/` - Next.js App Router directory containing routes and layouts
    - `src/app/layout.tsx` - Root layout with Geist font configuration and locale detection
    - `src/app/[locale]/` - Locale-based routing (en, zh, ko)
      - `src/app/[locale]/layout.tsx` - Locale layout with Lingui provider
      - `src/app/[locale]/page.tsx` - Home page component
    - `src/app/globals.css` - Global styles with Tailwind CSS v4 and theme variables
  - `src/lib/` - Utility functions
    - `src/lib/utils.ts` - Contains `cn()` helper for merging Tailwind classes
    - `src/lib/i18n.ts` - i18n configuration and locale types
  - `src/components/` - Reusable React components
    - `src/components/LinguiProvider.tsx` - Client-side i18n provider wrapper
  - `src/locales/` - Translation message catalogs
    - `src/locales/en/messages.po` - English messages
    - `src/locales/zh/messages.po` - Chinese messages
    - `src/locales/ko/messages.po` - Korean messages
- `middleware.ts` - Locale detection and routing middleware
- `public/` - Static assets

### Path Aliases
The project uses `@/*` path alias configured in `tsconfig.json`:
```typescript
"@/*": ["./src/*"]
```

shadcn/ui component aliases:
- `@/components` - General components
- `@/components/ui` - UI components from shadcn/ui
- `@/lib` - Utility libraries
- `@/lib/utils` - Utility functions
- `@/hooks` - Custom React hooks

### Styling System

**Tailwind CSS v4** with custom theme:
- Uses `@import "tailwindcss"` syntax (v4)
- CSS variables defined with `@theme inline` block
- OKLCH color space for color definitions
- Dark mode support via `.dark` class
- Custom radius tokens from `--radius-sm` to `--radius-4xl`
- Includes `tw-animate-css` for animations

**shadcn/ui Configuration:**
- Style: `new-york`
- Base color: `neutral`
- Icon library: `lucide-react`
- CSS variables enabled
- RSC (React Server Components) enabled

### Key Dependencies

**UI & Styling:**
- `tailwind-merge` + `clsx` - Combined via `cn()` utility for conditional class merging
- `lucide-react` - Icon library
- `class-variance-authority` - For component variants

**Framework:**
- Next.js 16.0.10 with App Router
- React 19.2.3
- TypeScript 5

**Internationalization:**
- `@lingui/core` - Core i18n runtime
- `@lingui/react` - React integration
- `@lingui/macro` - Compile-time message extraction macros
- `@lingui/cli` - Command-line tools for message extraction/compilation
- `@lingui/swc-plugin` - SWC plugin for Next.js integration

### Fonts
Uses Geist font family (Sans and Mono variants) loaded via `next/font/google`:
- CSS variables: `--font-geist-sans` and `--font-geist-mono`
- Applied globally in root layout

## Component Development

When adding shadcn/ui components, they will be installed to `@/components/ui` and can be added via:
```bash
npx shadcn@latest add [component-name]
```

Components should follow the New York style variant and use the configured aliases.

## TypeScript Configuration

- Target: ES2017
- Strict mode enabled
- Module resolution: bundler
- JSX: react-jsx (automatic runtime)
- Incremental builds enabled

## Internationalization (i18n)

### Overview
The application uses **Lingui** for internationalization with support for three locales:
- `en` - English (default/source locale)
- `zh` - Chinese
- `ko` - Korean

### Locale Routing
- Middleware automatically detects and redirects users to locale-prefixed routes
- Routes are structured as `/{locale}/...` (e.g., `/en/`, `/zh/`, `/ko/`)
- Locale detection priority:
  1. URL pathname (`/zh/page`)
  2. `Accept-Language` header
  3. Falls back to `en`

### Working with Translations

**Adding translatable text:**
```tsx
import { Trans, t } from "@lingui/macro";

// For JSX content
<Trans>Hello World</Trans>

// For string values (placeholders, aria-labels, etc)
const label = t`Hello World`;
```

**Translation workflow:**
1. Add `Trans` or `t` macros to your code
2. Run `npm run i18n:extract` to extract messages to `.po` files
3. Translate messages in `src/locales/{locale}/messages.po`
4. Run `npm run i18n:compile` to compile for production (optional in dev)

### Configuration Files
- `lingui.config.ts` - Lingui configuration (locales, catalogs path, format)
- `middleware.ts` - Locale detection and routing logic
- `src/lib/i18n.ts` - Locale types and validation utilities
- `next.config.ts` - Includes Lingui SWC plugin configuration
