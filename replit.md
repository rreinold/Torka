# Torka - Academic Text Reader Application

## Overview

Torka is a modern web-based academic text reader application that transforms static textbooks into dynamic, personalized learning experiences with AI-generated multimedia content. The platform features:

1. **Landing Page** (`/`): Marketing site with navigation to all sections, showcasing Torka's value proposition, features, and benefits for personalized learning
2. **Learning Profile** (`/profile`): Comprehensive dashboard displaying personalized learning analytics including learning style radar charts, comprehension speed graphs, retention scores, optimal study times, media preferences, and quick stats
3. **Reader Application** (`/reader`): Full-featured PDF-like reading experience with advanced annotation and multimedia capabilities

The reader features a three-panel layout with a central document viewer, collapsible sidebar for notes and outline navigation, and a comprehensive toolbar for navigation and document manipulation. Built with a focus on academic workflows, it supports search functionality, note-taking, AI-generated diagrams (via Gemini), text-to-speech narration (via ElevenLabs), and interactive multiple-choice quizzes.

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
- **Landing page** (`/pages/Landing.tsx`): Marketing landing page with navigation bar, hero section, value proposition, features, benefits, testimonials, and CTAs
- **Profile page** (`/pages/Profile.tsx`): Learning analytics dashboard with Recharts visualizations including:
  - Radar chart for learning style modalities (Visual, Auditory, Reading/Writing, Kinesthetic)
  - Line graph for comprehension speed by media type
  - Progress rings for retention scores (24hr, 1-week, 1-month)
  - Bar chart for optimal study hours
  - Horizontal bars for media preference effectiveness
  - Gauges for complexity preference and learning pace
  - Quick stats sidebar (study sessions, quiz score, profile confidence, streak)
- **Reader page** (`/pages/Reader.tsx`): Main reading application that orchestrates all subcomponents
- **TextViewer**: Handles document rendering and page navigation
- **Toolbar**: Provides navigation and zoom controls
- **Sidebar**: Simplified to two tabs - Notes (default) and Outline for quick section navigation
- **SearchPanel**: Document-wide search functionality with result highlighting
- **Multimedia Section**: Bottom section with AI-generated images (Gemini) and audio narration (ElevenLabs)
- **Quiz Component**: Interactive multiple-choice quiz with visual feedback

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
- Storage abstraction interface (`IStorage`) provides a clean API for data operations
- PostgreSQL database implementation (`DbStorage`) for persistent data storage
- Database connection via Neon serverless with Drizzle ORM
- All user data (annotations, bookmarks, notes) persists permanently

**Key Design Decisions:**
- **Separation of concerns:** Routes handle HTTP, storage layer handles data persistence
- **Type safety:** Shared schema definitions between client and server via `@shared` directory
- **Validation:** Zod schemas ensure data integrity at API boundaries
- **Persistence:** Database-backed storage ensures data survives server restarts

### Data Storage Solutions

**Current Implementation:**
- PostgreSQL database (via Neon serverless) for persistent storage
- Database connection configured in `server/db.ts` using Drizzle ORM
- Storage implementation in `server/storage.ts` using `DbStorage` class
- Three main entities: Annotations, Bookmarks, Notes
- UUID-based identifiers for all resources

**Database Configuration:**
- Drizzle ORM for type-safe query building and PostgreSQL compatibility
- Schema definitions in `shared/schema.ts` using `drizzle-orm/pg-core`
- Migration configuration in `drizzle.config.ts`
- Environment variable `DATABASE_URL` for connectivity
- Migrations run via `npm run db:push` command

**Schema Design:**
- **Annotations Table:** Stores highlights, underlines, and other text annotations with type, pageNumber, color, content, position (JSONB), textSelection (JSONB), createdAt
- **Bookmarks Table:** Page markers with id, label, pageNumber, createdAt
- **Notes Table:** User notes with id, content, createdAt, updatedAt
- **Users Table:** Prepared for future authentication with username/password

**Rationale:**
- PostgreSQL provides reliable, persistent data storage
- Drizzle ORM ensures type-safe database operations
- JSONB fields for flexible storage of complex annotation data
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