# Academic Text Reader Application

## Overview

This is a modern web-based academic text reader application designed to provide a PDF-like reading experience with advanced annotation and multimedia capabilities. The application features a three-panel layout with a central document viewer, collapsible sidebar for tools and annotations, and a comprehensive toolbar for navigation and document manipulation. Built with a focus on academic workflows, it supports text highlighting, note-taking, bookmarking, and search functionality similar to professional PDF readers like Adobe Acrobat.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework Stack:**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and data fetching
- Tailwind CSS for utility-first styling with custom design system

**UI Component Library:**
- Radix UI primitives for accessible, unstyled component foundations
- shadcn/ui component system (New York style variant) for consistent design language
- Custom theme provider supporting light/dark modes
- Design guidelines emphasize Adobe Acrobat-inspired professional aesthetic combined with Material Design principles

**Key Design Decisions:**
- **Three-panel layout:** Center viewer (55-70% width), collapsible right sidebar (30% width), top toolbar
- **Typography system:** Serif fonts (Georgia/Charter) for reading content, sans-serif (Inter/SF Pro) for UI chrome
- **Spacing primitives:** Tailwind units (1, 2, 3, 4, 6, 8, 12, 16, 20) for consistent spacing hierarchy
- **Content-first philosophy:** Text rendering takes precedence over UI chrome, distraction-free reading environment

**State Management:**
- React Query for server-synchronized state (annotations, bookmarks, notes)
- Local React state for UI interactions (zoom level, current page, active tools)
- Theme context for dark/light mode preferences

**Component Architecture:**
- Main Reader page orchestrates all subcomponents
- TextViewer handles document rendering and page navigation
- Toolbar provides navigation and zoom controls
- Sidebar manages tabs for annotations, bookmarks, and notes
- AnnotationToolbar enables markup tool selection
- SearchPanel provides document-wide search functionality

### Backend Architecture

**Server Framework:**
- Express.js as the HTTP server
- TypeScript with ES modules
- Custom middleware for request logging and JSON parsing
- Vite integration for development mode with HMR

**API Design:**
- RESTful endpoints under `/api` prefix
- Resource-based routing for annotations, bookmarks, and notes
- Standard HTTP methods (GET, POST, DELETE) for CRUD operations
- Zod schemas for request validation
- Centralized error handling with appropriate HTTP status codes

**Data Layer:**
- Storage abstraction interface (`IStorage`) allows swapping implementations
- In-memory storage implementation (`MemStorage`) for development
- Designed to support database integration (currently uses Drizzle ORM setup for future PostgreSQL migration)

**Key Design Decisions:**
- **Separation of concerns:** Routes handle HTTP, storage layer handles data persistence
- **Type safety:** Shared schema definitions between client and server via `@shared` directory
- **Validation:** Zod schemas ensure data integrity at API boundaries
- **Abstraction:** Storage interface enables easy migration from in-memory to database persistence

### Data Storage Solutions

**Current Implementation:**
- In-memory Map-based storage for rapid development
- Three main entities: Annotations, Bookmarks, Notes
- UUID-based identifiers for all resources

**Database Migration Ready:**
- Drizzle ORM configured for PostgreSQL (via Neon serverless)
- Schema definitions in `shared/schema.ts` using `drizzle-orm/pg-core`
- Migration configuration in `drizzle.config.ts`
- Environment variable for `DATABASE_URL` connectivity

**Schema Design:**
- **Annotations:** Support multiple types (highlight, underline, strikethrough, note, drawing, shape, textbox) with position data, text selections, and colors
- **Bookmarks:** Simple page markers with labels
- **Notes:** Rich text content with timestamps
- **Users:** Prepared for authentication (username/password, currently unused)

**Rationale:**
- In-memory storage allows rapid prototyping without database setup
- Drizzle ORM chosen for type-safe query building and PostgreSQL compatibility
- Shared Zod schemas ensure validation consistency between API and database layers
- Neon serverless PostgreSQL enables scalable deployment without infrastructure management

### External Dependencies

**Third-party UI Libraries:**
- Radix UI component primitives (accordion, dialog, dropdown-menu, popover, select, tabs, toast, tooltip, etc.)
- Embla Carousel for potential media carousels
- cmdk for command palette functionality
- react-day-picker for date selection (calendar component)
- Lucide React for icon system

**Data Management:**
- @tanstack/react-query (v5) for server state synchronization
- React Hook Form with Zod resolvers for form validation
- date-fns for date formatting and manipulation

**Database & ORM:**
- Drizzle ORM for type-safe database queries
- @neondatabase/serverless for PostgreSQL connectivity
- drizzle-zod for schema-to-Zod conversion
- connect-pg-simple for PostgreSQL session store (prepared for authentication)

**Build Tools:**
- Vite with React plugin and custom Replit plugins
- TypeScript compiler for type checking
- Tailwind CSS with PostCSS for styling
- esbuild for server-side bundling

**Development Tools:**
- tsx for TypeScript execution in development
- @replit/vite-plugin-runtime-error-modal for error overlays
- @replit/vite-plugin-cartographer and dev-banner (Replit-specific development aids)

**Design System:**
- Tailwind CSS for utility classes
- class-variance-authority for variant-based component styling
- clsx and tailwind-merge for conditional class composition

**Fonts:**
- Google Fonts: Architects Daughter, DM Sans, Fira Code, Geist Mono (loaded via HTML link tags)