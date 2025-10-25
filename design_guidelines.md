# Design Guidelines: Academic Text Reader Application

## Design Approach
**Selected Framework:** Design System Hybrid - Adobe Acrobat professional aesthetic + Material Design principles for productivity applications

**Core Philosophy:** Create a sophisticated, distraction-free reading environment that prioritizes content legibility, efficient tool access, and professional academic workflows. The interface should feel authoritative yet unobtrusive, allowing readers to focus on content while maintaining instant access to advanced annotation and multimedia tools.

**Key Design Principles:**
1. Content-first hierarchy - text rendering takes precedence over chrome
2. Efficient tool discoverability without visual clutter
3. Consistent spatial relationships for muscle memory
4. Professional, academic credibility through restrained design choices

---

## Typography System

**Text Content (Main Reader):**
- Primary reading font: Georgia or Charter (serif for extended reading comfort)
- Body text: 16-18px base size, 1.6-1.8 line-height for optimal readability
- Paragraph spacing: 1.5em between paragraphs
- Maximum line length: 65-75 characters (optimal reading width)
- Section headings: 24-28px, semi-bold weight, 1.3 line-height
- Sub-headings: 20-22px, medium weight

**UI Chrome (Toolbars & Sidebars):**
- Interface font: Inter, SF Pro, or Segoe UI (sans-serif for clarity)
- Toolbar labels: 13-14px, medium weight
- Sidebar headings: 14-15px, semi-bold
- Sidebar content: 13-14px, regular weight
- Button text: 13-14px, medium weight
- Dropdown/input fields: 13px, regular weight

**Annotation Text:**
- Sticky notes: 13px, regular weight, 1.5 line-height
- Text boxes on canvas: 14px, regular weight

---

## Layout System

**Spacing Primitives:** Tailwind units of 1, 2, 3, 4, 6, 8, 12, 16, 20
- Micro spacing (icons, badges): 1, 2
- Component internal padding: 2, 3, 4
- Component gaps/margins: 4, 6, 8
- Section spacing: 12, 16, 20
- Panel gutters: 4, 6

**Three-Panel Architecture:**

1. **Top Toolbar (h-14 to h-16):**
   - Fixed positioning, z-index above content
   - Horizontal padding: px-4
   - Internal item spacing: gap-2 for grouped tools, gap-6 between groups
   - Left section: Logo/title, document name
   - Center section: Zoom controls, page navigation
   - Right section: Tool buttons, settings, dark mode toggle

2. **Main Content Area (Center Panel 55-70% width):**
   - Background: distinct from UI chrome (reading surface)
   - Content padding: px-8 md:px-12 lg:px-16, py-8
   - Maximum content width: max-w-4xl for text, centered
   - Paragraph spacing: mb-6 between paragraphs
   - Section spacing: mt-12 between major sections
   - Smooth scroll behavior with scroll-padding-top: 80px (for fixed toolbar)

3. **Right Sidebar (30% width, min-w-80, collapsible):**
   - Tab navigation: h-12, px-4 for each tab
   - Tab content padding: p-4
   - List items (annotations): py-3, px-4, hover state
   - Section divisions: border-b with mb-4, pb-4
   - Scrollable content area with overflow-y-auto

**Responsive Behavior:**
- Desktop (lg): Three-panel layout as specified
- Tablet (md): Sidebar becomes overlay/drawer from right
- Mobile (base): Full-width content, toolbar collapses to hamburger menu, floating action button for tools

---

## Component Library

### Navigation Components

**Toolbar Button Groups:**
- Button size: h-9, px-3
- Icon size: 18-20px
- Group containers: flex gap-1, rounded-lg border, p-1
- Dividers between groups: w-px h-6 (vertical separator)

**Zoom Controls:**
- Dropdown trigger: min-w-24, justify-between with chevron icon
- Increment/decrement buttons: square aspect (w-9 h-9)
- Preset buttons: "Fit Width", "Fit Page" as text buttons

**Page Navigation:**
- Current page input: w-16, text-center, border-b only (minimal)
- Total pages: text-sm, opacity-70
- Format: "15 / 234" with slash having mx-2
- Previous/Next buttons: square w-9 h-9 with arrow icons
- Jump buttons (first/last): same size, different icons

### Annotation Tools

**Toolbar Tool Buttons:**
- Primary tools (highlight, annotate): h-9, px-3, icon + label
- Color picker dropdown: displays selected color as dot indicator
- Active tool state: distinct treatment (border or background)

**Color Palette Display:**
- Swatch size: w-8 h-8, rounded-md
- Layout: grid grid-cols-5 gap-2
- Selected state: ring-2 offset-2

**Annotation Markers (on canvas):**
- Highlight overlay: opacity-30, pointer-events-none for base, full opacity for hover
- Sticky note icon: w-6 h-6, positioned at text anchor point
- Drawing stroke: 2-4px width options
- Shapes: 1-2px border, fill opacity-10

### Sidebar Components

**Tab Navigation:**
- Tab bar: border-b, flex
- Individual tabs: px-4 py-3, hover state
- Active tab: border-b-2 offset indicator
- Badge counts: ml-2, text-xs, px-2 py-0.5, rounded-full

**Annotation List Items:**
- Container: rounded-md, p-3, hover background
- Quote preview: text-sm, italic, truncate after 2 lines
- Metadata row: flex justify-between, text-xs, opacity-70, mt-2
- Page indicator: clickable, underline on hover

**Rich Text Editor (Notes Tab):**
- Toolbar: h-10, border-b, flex gap-1, px-2
- Tool buttons: w-8 h-8, square
- Editor area: p-4, min-h-48, focus:outline-none
- Format groups: Bold, Italic, Underline | Lists | Indent

**Bookmark Items:**
- Icon + label layout: flex items-center gap-2
- Timestamp: text-xs, opacity-60, ml-8
- Delete button: opacity-0 group-hover:opacity-100 transition

### Form Elements

**Input Fields:**
- Height: h-9
- Padding: px-3
- Border: 1px rounded-md
- Focus state: ring-2

**Dropdowns:**
- Trigger height: h-9
- Menu max-height: max-h-64, overflow-y-auto
- Menu item: px-3 py-2, hover state
- Dividers: my-1 for grouping

**Buttons:**
- Primary action: h-9, px-4, rounded-md
- Secondary: same size, outline style
- Icon-only: w-9 h-9, square, centered icon
- Small variant: h-8, px-3, text-sm

### Search Interface

**Search Bar:**
- Input: h-9, pl-9 (icon space), pr-20 (controls space)
- Search icon: absolute left-3, w-4 h-4
- Result counter: text-xs, position absolute right side
- Navigation arrows: w-7 h-7, positioned right-2

**Search Results Highlight:**
- Active result: distinct visual treatment
- Other results: secondary highlight
- Result markers in scrollbar (if feasible)

### Canvas Overlay (for Drawing/Shapes)

**Canvas Container:**
- Position: absolute, covers content area
- Pointer events: pointer-events-auto when active tool
- Cursor: changes based on active tool (crosshair, pen, grab)

**Drawing Controls:**
- Floating toolbar: fixed bottom-right, rounded-lg, p-2
- Tool options: stroke width, opacity sliders
- Dimensions: compact, w-48, elevation shadow

---

## Interaction Patterns

**Hover States:**
- Buttons: subtle background change, no scale transforms
- List items: background transition 150ms
- Tool icons: opacity change to 80% → 100%

**Active/Focus States:**
- Inputs: ring-2 treatment
- Buttons: slightly darker background
- Tab active: border indicator + slight background

**Transitions:**
- Sidebar collapse/expand: 300ms ease-in-out
- Panel resizing: smooth transition-all 200ms
- Annotation appearance: fade-in 150ms
- Dark mode toggle: 200ms all properties

**Loading States:**
- Content loading: skeleton screens with pulse animation
- Button actions: spinner icon, disabled state
- Page navigation: brief opacity transition

**Scrolling Behavior:**
- Smooth scroll for jump-to navigation
- Scroll-margin-top: 80px for toolbar clearance
- Sticky sidebar headers when scrolling tabs

---

## Accessibility Implementation

**Keyboard Navigation:**
- All toolbar buttons: tab-accessible with focus ring
- Arrow key navigation: between annotations in sidebar
- Escape key: closes modals, deselects tools
- Spacebar: page down (when not in input)
- Shortcuts visible on hover tooltips

**Screen Reader Support:**
- Semantic HTML throughout
- ARIA labels for icon-only buttons
- Announce page changes
- Announce annotation additions
- Live region for search results count

**Focus Management:**
- Visible focus rings: ring-2 on all interactive elements
- Focus trap in modals
- Return focus after modal close

---

## Images

This application does NOT require images as it's a document reader interface. All visual elements are UI chrome, icons, and user-generated content (annotations, drawings). No hero images or marketing imagery needed.