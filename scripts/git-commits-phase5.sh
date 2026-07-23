#!/bin/bash
set -e
cd /c/SAMAR/FINALSEC

# Commit 37: Host verification flow
git add app/components/host-verification-page.tsx app/components/host-page.tsx app/host/layout.tsx app/host/host-header.tsx
git commit -m "feat: build host verification flow with ID document upload"

# Commit 38: Host dashboard and overview
git add app/components/host-dashboard-page.tsx app/components/host-overview-page.tsx app/components/host-calendar-page.tsx
git commit -m "feat: add host dashboard, overview and calendar views"

# Commit 39: Listing creation wizard
git add app/components/listing-creation-wizard.tsx app/host/create/page.tsx
git commit -m "feat: build 12-step listing creation wizard with map picker"

# Commit 40: Experience creation wizard
git add app/components/experience-creation-wizard.tsx
git commit -m "feat: build experience creation wizard with itinerary builder"

# Commit 41: Host listings management
git add app/components/host-listings-page.tsx app/host/listings/page.tsx app/host/listings/\[id\]/page.tsx app/host/listings/\[id\]/location-map.tsx
git commit -m "feat: add host listings CRUD with location map editor"

# Commit 42: Host experiences management
git add app/components/host-experiences-page.tsx app/host/experiences/page.tsx app/host/experiences/\[id\]/page.tsx
git commit -m "feat: add host experiences CRUD with availability management"

echo "Phase 5 complete - Host features committed"
