# Design Guidelines: Discord Guild Management System

## Design Approach
**Selected Approach**: Custom Gaming-Inspired Design System with Dark Mode Foundation

**Justification**: Gaming guild management requires a balance of utility (data-heavy tables, forms) and aesthetic appeal (engaging dashboard, clear hierarchy). The design draws inspiration from modern gaming UIs (Discord, League of Legends client) while maintaining professional admin panel functionality.

**Core Principles**:
- Dark-first design for reduced eye strain during extended use
- Clear information hierarchy for quick scanning
- Vibrant accents for status indicators and CTAs
- Consistent spacing and visual rhythm across all views

---

## Color Palette

### Dark Mode (Primary Theme)
- **Background Base**: 220 15% 8% (deep slate, main background)
- **Surface Elevated**: 220 18% 12% (cards, panels)
- **Surface Interactive**: 220 20% 16% (hover states, input fields)
- **Border Subtle**: 220 15% 20% (dividers, borders)

### Brand & Accent Colors
- **Primary (Blue)**: 220 85% 60% (primary actions, links)
- **Success (Green)**: 145 70% 55% (positive actions, success states)
- **Warning (Amber)**: 38 92% 50% (important notices)
- **Danger (Red)**: 0 75% 60% (destructive actions, alerts)
- **Purple Accent**: 270 75% 65% (special features, rankings)

### Text Colors
- **Primary Text**: 0 0% 98% (main content)
- **Secondary Text**: 220 10% 70% (labels, descriptions)
- **Muted Text**: 220 10% 50% (disabled, timestamps)

---

## Typography

**Font Stack**: 
- Primary: 'Inter', system-ui, sans-serif (clean, modern readability)
- Monospace: 'JetBrains Mono', monospace (stats, numbers, codes)

**Hierarchy**:
- **Headings**: Font-semibold to font-bold, tight letter-spacing
  - H1: text-3xl to text-4xl (page titles)
  - H2: text-2xl (section headers)
  - H3: text-xl (subsections)
- **Body Text**: text-sm to text-base, leading-relaxed for readability
- **Labels**: text-xs uppercase tracking-wide font-medium
- **Stats/Numbers**: Use monospace font for numerical data

---

## Layout System

**Spacing Primitives**: Consistent use of Tailwind units: 2, 4, 6, 8, 12, 16, 20, 24

**Grid Structure**:
- Main Container: max-w-7xl mx-auto px-4 to px-8
- Dashboard Cards: gap-4 to gap-6 grid layouts
- Data Tables: Full-width with contained scrolling
- Forms: max-w-2xl for focused input areas

**Responsive Breakpoints**:
- Mobile: Stack all columns, condensed spacing (p-4)
- Tablet (md:): 2-column grids, moderate spacing (p-6)
- Desktop (lg:): 3-4 column grids, generous spacing (p-8)

---

## Component Library

### Navigation & Structure
- **Sidebar Navigation**: Fixed left sidebar (w-64) with icon + label menu items, collapsible on mobile
- **Top Bar**: Fixed header with search, notifications, user profile dropdown
- **Breadcrumbs**: Subtle navigation path for deep sections

### Dashboard Components
- **Stat Cards**: Elevated surface cards with large numbers, icons, and trend indicators (4-column grid on desktop)
- **Activity Feed**: Timeline-style list with user avatars, action descriptions, timestamps
- **Event Status Cards**: Prominent cards showing active events with participant count and check-in button

### Data Display
- **Member Tables**: Striped rows, sortable columns, quick actions (edit/view), pagination
- **Rankings Lists**: Numbered list with medals for top 3, progress bars for visual comparison
- **Event Logs**: Chronological list with event icons, participant counts, point totals

### Forms & Inputs
- **Input Fields**: Dark background (surface interactive), subtle border, focus ring in primary color
- **Select Dropdowns**: Custom styled with chevron icons, dark overlay menu
- **Buttons**:
  - Primary: bg-primary with white text, hover brightness increase
  - Secondary: border with primary color, transparent background
  - Danger: bg-danger for destructive actions
  - Ghost: Hover background only, for subtle actions
- **Modal Dialogs**: Centered overlay with dark backdrop blur, elevated surface

### Marketplace & Inventory
- **Item Cards**: Grid layout with item image/icon, name, price/status, action button
- **Inventory List**: Table view with item details, quantity, controls (admin only)
- **Trade Interface**: Split view showing sender/receiver with item/point exchange

### Event Management
- **Event Selector**: Dropdown menu with event icons, point values clearly displayed
- **Check-in Button**: Large, prominent button with participant counter, disabled after check-in
- **Active Event Badge**: Floating indicator on sidebar showing active events count

---

## Interaction Patterns

### Animations (Minimal & Purposeful)
- Card hover: Subtle scale (scale-105) with transition-transform
- Button states: Smooth color transitions (transition-colors duration-200)
- Modal entry: Fade + slight scale animation
- List updates: Gentle slide-in for new items

### Visual Feedback
- Loading States: Skeleton screens for tables, spinner for actions
- Success/Error: Toast notifications in top-right corner
- Form Validation: Inline error messages below fields with danger color

---

## Images & Icons

### Icons
Use **Heroicons** (outline for navigation, solid for status indicators)
- Event types: Custom emoji mappings (🐉, ⚔️, 🏰 as displayed in requirements)
- Status indicators: Check circles, warning triangles, info circles
- Actions: Pencil (edit), trash (delete), eye (view), plus (add)

### Images
- **Member Avatars**: Circular, 40px-48px for lists, 96px-128px for profiles
- **Event Backgrounds**: Optional subtle background patterns for event cards
- **Empty States**: Friendly illustrations for empty lists/tables (can use placeholder comments for custom illustrations)

---

## Accessibility & Quality

- **Contrast**: Maintain WCAG AA standards with text-to-background ratios
- **Keyboard Navigation**: Full tab-through support, visible focus states
- **Screen Readers**: Proper ARIA labels for interactive elements
- **Dark Mode Consistency**: All inputs, modals, tooltips use dark theme palette
- **Responsive Text**: Font sizes scale appropriately across breakpoints

---

## Page-Specific Guidelines

### Dashboard
4-column stat cards → 3-row activity feed → active events section with large check-in CTAs

### Member Management
Search + filters bar → sortable table → pagination → quick action buttons (view/edit) in rows

### Rankings
Tabbed interface (Level / Power / Event Points) → numbered list with visual indicators for top performers

### Events
Timeline of past events → active event cards (if any) → create event button (for authorized roles)

### Marketplace
Grid of item cards (2-3 columns) → filters by status → member-only access indicator

### Guild Inventory
Admin-controlled table view → add item form → quantity tracking → visual stock indicators