# Discord Guild Management System

## Overview

This is a Discord bot admin panel for managing a gaming guild. The system allows administrators to track guild members, manage events, monitor rankings, handle marketplace transactions, and manage point transfers. The application consists of a React-based admin dashboard and a Discord bot that integrates with guild activities through slash commands and interactive components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React with TypeScript for type safety
- Vite as the build tool and dev server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query for server state management and caching
- shadcn/ui components with Radix UI primitives for accessible UI elements
- Tailwind CSS for styling with custom design system

**Design System:**
- Dark-first design optimized for gaming environment
- Custom color palette with gaming-inspired aesthetics
- Consistent component variants using class-variance-authority
- Responsive layout with mobile support
- Inter font for UI text, JetBrains Mono for stats/numbers

**Key Frontend Patterns:**
- Component composition with reusable UI building blocks
- Custom hooks for mobile detection and toast notifications
- Centralized query client configuration with custom fetch utilities
- Path aliases for clean imports (@/ for client, @shared for shared types)

### Backend Architecture

**Technology Stack:**
- Express.js server with TypeScript
- Drizzle ORM for database operations
- PostgreSQL (Neon serverless) for data persistence
- Discord.js v14 for bot functionality
- Session-based architecture (connect-pg-simple for session storage)

**API Design:**
- RESTful endpoints organized by resource (members, events, marketplace, etc.)
- Zod schema validation for request data
- Consistent error handling with status codes
- JSON response format throughout

**Key Backend Patterns:**
- Storage abstraction layer (IStorage interface) separating business logic from data access
- Environment-based configuration (development/production modes)
- Middleware for request logging and error handling
- In-memory state management for active Discord events and configurations

### Database Schema

**Core Tables:**
- `members`: Guild member profiles with Discord ID, class, level, power, event points
- `events`: Event definitions with points, emoji, status tracking
- `event_participations`: Many-to-many relationship for event check-ins
- `marketplace_items`: Player-to-player item trading system
- `point_transfers`: Point transfer requests with approval workflow
- `activities`: Audit log for guild activities
- `item_drops`: Event rewards and loot distribution
- `bot_config`: Per-guild Discord bot configuration (eventManagerRoleId, signUpRoleId)

**Database Patterns:**
- UUID primary keys (gen_random_uuid())
- Timestamp tracking for created/updated records
- Foreign key relationships with references
- Status fields for workflow states (pending/approved/rejected, available/sold)

### Discord Bot Integration

**Bot Capabilities:**
- Slash commands for event management and interactions
- Interactive components (buttons, select menus, modals)
- Role-based permissions for event managers
- Real-time event participation tracking
- Message-based event announcements with interactive UI
- Member sign-up system with character detail forms and automatic role assignment

**Bot Patterns:**
- Command registration on startup
- Interaction handlers for different component types (buttons, select menus, modals)
- In-memory tracking of active event messages
- Permission checks before allowing administrative actions

**Integration Flow:**
1. Bot starts and registers slash commands
2. Admin uses `/start-event` to create event message
3. Members interact with buttons to check in
4. Admin ends event, points are automatically distributed
5. Activities are logged and reflected in admin dashboard

**Sign-Up System Flow:**
1. Admin uses `/configurar-signup` to set the role assigned to new members
2. Admin uses `/signup` to post a sign-up button in a channel
3. New members click the sign-up button
4. A modal form appears requesting character details (name, class, level, power)
5. Upon submission, member is created and automatically assigned the configured role
6. System prevents duplicate registrations

### External Dependencies

**Third-Party Services:**
- Neon Database: Serverless PostgreSQL hosting with connection pooling
- Discord API: Bot authentication and guild interactions via discord.js

**Key NPM Packages:**
- @radix-ui/*: Accessible component primitives (20+ components)
- @tanstack/react-query: Server state management
- drizzle-orm & drizzle-kit: Type-safe database ORM and migrations
- discord.js: Discord bot framework with full API support
- zod: Runtime type validation
- date-fns: Date formatting and manipulation
- react-hook-form: Form state management with @hookform/resolvers

**Build & Development Tools:**
- esbuild: Fast server-side bundling
- tsx: TypeScript execution for development
- Vite plugins: Runtime error overlay, dev banner, source mapping (@replit/*)

**Authentication:**
- Currently uses session-based authentication (connect-pg-simple)
- Discord OAuth can be added for user authentication
- Bot uses DISCORD_BOT_TOKEN environment variable for authentication