#!/bin/bash
set -e
cd /c/SAMAR/FINALSEC

# Commit 6: Core UI primitives (Button, Input, Label, Card)
git add app/components/ui/button.tsx app/components/ui/input.tsx app/components/ui/label.tsx app/components/ui/card.tsx
git commit -m "feat: add core UI primitives - Button, Input, Label, Card components"

# Commit 7: Layout and navigation components
git add app/components/ui/badge.tsx app/components/ui/separator.tsx app/components/ui/avatar.tsx app/components/ui/scroll-area.tsx app/components/ui/skeleton.tsx
git commit -m "feat: add layout UI components - Badge, Separator, Avatar, ScrollArea, Skeleton"

# Commit 8: Dialog and overlay components
git add app/components/ui/dialog.tsx app/components/ui/drawer.tsx app/components/ui/sheet.tsx app/components/ui/popover.tsx app/components/ui/hover-card.tsx app/components/ui/tooltip.tsx
git commit -m "feat: add dialog and overlay components - Dialog, Drawer, Sheet, Popover, Tooltip"

# Commit 9: Form and input components
git add app/components/ui/form.tsx app/components/ui/field.tsx app/components/ui/select.tsx app/components/ui/checkbox.tsx app/components/ui/radio-group.tsx app/components/ui/switch.tsx app/components/ui/textarea.tsx app/components/ui/input-otp.tsx
git commit -m "feat: add form and input components - Select, Checkbox, Switch, Textarea, InputOTP"

# Commit 10: Navigation and menu components
git add app/components/ui/tabs.tsx app/components/ui/accordion.tsx app/components/ui/navigation-menu.tsx app/components/ui/menubar.tsx app/components/ui/breadcrumb.tsx app/components/ui/pagination.tsx
git commit -m "feat: add navigation components - Tabs, Accordion, Menu, Breadcrumb, Pagination"

# Commit 11: Data display components
git add app/components/ui/table.tsx app/components/ui/carousel.tsx app/components/ui/chart.tsx app/components/ui/progress.tsx app/components/ui/slider.tsx app/components/ui/aspect-ratio.tsx app/components/ui/empty.tsx
git commit -m "feat: add data display components - Table, Carousel, Chart, Progress, Slider"

# Commit 12: Feedback and alert components
git add app/components/ui/alert.tsx app/components/ui/alert-dialog.tsx app/components/ui/toast.tsx app/components/ui/toaster.tsx app/components/ui/sonner.tsx app/components/ui/use-toast.ts app/components/ui/spinner.tsx
git commit -m "feat: add feedback components - Alert, Toast, Sonner, Spinner"

# Commit 13: Dropdown and command components
git add app/components/ui/dropdown-menu.tsx app/components/ui/context-menu.tsx app/components/ui/command.tsx app/components/ui/input-group.tsx app/components/ui/button-group.tsx app/components/ui/item.tsx
git commit -m "feat: add interactive components - DropdownMenu, ContextMenu, Command palette"

# Commit 14: Collapsible, resizable and utility components
git add app/components/ui/collapsible.tsx app/components/ui/resizable.tsx app/components/ui/sidebar.tsx app/components/ui/use-mobile.tsx app/components/ui/toggle.tsx app/components/ui/toggle-group.tsx app/components/ui/kbd.tsx
git commit -m "feat: add utility components - Collapsible, Resizable, Sidebar, Toggle, Keyboard"

# Commit 15: Theme provider
git add app/components/theme-provider.tsx
git commit -m "feat: add dark mode theme provider with next-themes"

echo "Phase 2 complete - UI components committed"
