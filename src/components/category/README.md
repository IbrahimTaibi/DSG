# Category Sidebar Navigation

A responsive, theme-aware sidebar navigation component for displaying categories with hierarchical structure.

## Features

### Desktop View
- **Persistent vertical sidebar** on the left side
- **Hierarchical display** with expandable/collapsible parent-child relationships
- **Clean and minimal design** with proper spacing and indentation
- **Theme-aware styling** that respects light/dark mode settings

### Mobile View
- **Hamburger menu** that replaces the sidebar
- **Slide-in sidebar** from left to right when hamburger is clicked
- **Same full category structure** as desktop with hierarchy
- **Existing category navbar** remains horizontally scrollable (not replaced)

## Technical Implementation

### Components

1. **CategorySidebar** (`CategorySidebar.tsx`)
   - Main sidebar component with responsive behavior
   - Handles desktop and mobile views
   - Manages expand/collapse state for categories
   - Auto-expands parent categories of active category

2. **HamburgerMenu** (`HamburgerMenu.tsx`)
   - Animated hamburger button for mobile
   - Theme-aware styling
   - Accessible with proper ARIA labels

3. **SidebarLayout** (`SidebarLayout.tsx`)
   - Layout wrapper that integrates sidebar with main content
   - Handles sidebar state management
   - Provides keyboard navigation (Escape key to close)

### Enhanced Hook

**useCategories** (`useCategories.ts`)
- Extended to support both flat and tree category structures
- Caches both formats to prevent refetching
- Includes `categoryTree` for hierarchical display
- Maintains backward compatibility with existing `categories` array

### Integration

- **Conditional rendering** in `_app.tsx` - sidebar only shows on category pages
- **Responsive breakpoints** - sidebar hidden on mobile, hamburger shown instead
- **Theme integration** - fully respects dark/light mode settings
- **Accessibility** - keyboard navigation, ARIA labels, focus management

## Usage

The sidebar is automatically integrated for all pages under `/category/*`. No additional setup required.

### Desktop
- Sidebar is always visible on the left
- Categories can be expanded/collapsed by clicking the arrow
- Active category is highlighted
- Parent categories of active category are auto-expanded

### Mobile
- Hamburger menu appears in the top-left
- Tap hamburger to open sidebar overlay
- Tap outside sidebar or press Escape to close
- Sidebar closes automatically on navigation

## Styling

- **Theme-aware colors** using the existing theme system
- **Smooth animations** for expand/collapse and mobile slide-in
- **Responsive design** with proper breakpoints
- **Consistent spacing** and typography with the rest of the app

## Accessibility

- **Keyboard navigation** support
- **ARIA labels** for expand/collapse buttons
- **Focus management** for mobile overlay
- **Screen reader friendly** structure
- **High contrast** support through theme system 