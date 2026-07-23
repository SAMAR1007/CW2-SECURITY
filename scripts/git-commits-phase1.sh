#!/bin/bash
set -e
cd /c/SAMAR/FINALSEC

# Commit 1: Project initialization
git add package.json tsconfig.json next.config.mjs postcss.config.mjs
git commit -m "feat: initialize Next.js 16 project with TypeScript and Turbopack"

# Commit 2: Styling and global CSS
git add app/globals.css tailwindcss.config.ts 2>/dev/null || git add app/globals.css
git commit -m "style: add Tailwind CSS v4 with custom theme and global styles"

# Commit 3: PWA and manifest configuration
git add app/manifest.ts app/layout.tsx app/loading.tsx
git commit -m "feat: configure PWA support with manifest and offline fallback"

# Commit 4: API layer setup
git add lib/utils.ts lib/api/
git commit -m "feat: set up axios API client with interceptors and endpoint constants"

# Commit 5: Project documentation and gitignore
git add .gitignore components.json
git commit -m "chore: add project configuration files and gitignore"

echo "Phase 1 complete"
git log --oneline
