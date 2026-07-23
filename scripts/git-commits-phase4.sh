#!/bin/bash
set -e
cd /c/SAMAR/FINALSEC

# Commit 22: Root layout with PWA support
git add app/layout.tsx app/page.tsx app/manifest.ts app/loading.tsx app/offline/page.tsx
git commit -m "feat: add root layout with PWA manifest and offline fallback page"

# Commit 23: Navigation bar with notification system
git add app/components/layout/navbar.tsx
git commit -m "feat: build responsive navbar with real-time notifications dropdown"

# Commit 24: Explore/home page
git add app/components/explore-page.tsx
git commit -m "feat: create explore page with featured stays and experiences"

# Commit 25: Stays search page
git add app/components/stays-search-page.tsx
git commit -m "feat: build stays search page with price range and guest filters"

# Commit 26: Experiences search page
git add app/components/experiences-search-page.tsx
git commit -m "feat: build experiences search page with category browsing"

# Commit 27: Map page with Leaflet integration
git add app/components/map-page.tsx app/components/location-picker-map.tsx app/components/location-picker-map-inner.tsx
git commit -m "feat: integrate Leaflet map with property markers and detail panels"

# Commit 28: Stay detail page with booking
git add app/stays/\[id\]/page.tsx app/components/property-page.tsx app/components/stay-location-map.tsx app/components/stay-location-map-inner.tsx
git commit -m "feat: build stay detail page with image gallery, reviews, and booking"

# Commit 29: Experience detail page
git add app/experiences/\[id\]/page.tsx
git commit -m "feat: build experience detail page with itinerary display"

# Commit 30: Reserve/booking pages
git add app/stays/\[id\]/reserve/page.tsx app/experiences/\[id\]/reserve/page.tsx
git commit -m "feat: add reservation pages with eSewa payment integration"

# Commit 31: User dashboard
git add app/\(dashboard\)/dashboard/page.tsx app/components/dashboard-pages.tsx 2>/dev/null || git add app/\(dashboard\)/dashboard/page.tsx
git commit -m "feat: build user dashboard with booking stats and activity overview"

# Commit 32: Trip management
git add app/components/trips-page.tsx app/components/trips-detail.tsx 2>/dev/null || git add app/components/trips-page.tsx
git commit -m "feat: add trips page showing upcoming, active, and past bookings"

# Commit 33: Wishlist with localStorage fallback
git add app/components/wishlist-page.tsx
git commit -m "feat: implement wishlist with localStorage fallback for offline use"

# Commit 34: Messaging center
git add app/components/messages-center.tsx app/messages/page.tsx app/host/messages/page.tsx
git commit -m "feat: build messaging center with conversation threading"

# Commit 35: Notifications system
git add app/components/notifications-page.tsx
git commit -m "feat: add notifications page with read/unread state management"

# Commit 36: AI assistant widget
git add app/components/ai-assistant-widget.tsx
git commit -m "feat: add AI assistant widget with trip recommendation engine"

echo "Phase 4 complete - Core features committed"
