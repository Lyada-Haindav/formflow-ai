# FormAI - AI-Powered Form Builder

## Overview

FormAI is a full-stack AI-powered form builder and management system that allows users to generate, build, and deploy multi-step forms with AI assistance. Users can describe forms via prompts to generate structured configurations, use drag-and-drop to customize forms, collect submissions, and view analytics. The application features voice-enabled input, template libraries, and QR code sharing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, bundled with Vite
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state and caching
- **UI Components**: Shadcn/UI component library built on Radix primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth transitions
- **Drag & Drop**: dnd-kit for form builder field reordering

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with tsx for TypeScript execution
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Replit Auth via OpenID Connect with Passport.js
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **API Design**: RESTful endpoints defined in shared/routes.ts with Zod validation

### Data Storage
- **Database**: PostgreSQL with JSONB columns for flexible data (form options, validation rules, submission data)
- **Schema Location**: shared/schema.ts defines all tables using Drizzle
- **Key Tables**:
  - `forms` - User-owned form definitions
  - `form_steps` - Multi-step form structure with ordering
  - `form_fields` - Individual fields with type, validation, and options
  - `submissions` - Form response data stored as JSONB
  - `templates` - Pre-built form templates
  - `sessions` - Auth session storage
  - `users` - User profiles from Replit Auth

### AI Integration
- **Provider**: Google Gemini via Replit AI Integrations (no API key needed in Replit environment)
- **OpenAI**: Used for speech-to-text (Whisper) and image generation
- **Features**: Form generation from prompts, field suggestions, voice input transcription

### Build System
- **Development**: Vite dev server with HMR, proxied through Express
- **Production**: Vite builds static assets, esbuild bundles server code
- **Output**: dist/public for client, dist/index.cjs for server

## External Dependencies

### AI Services (via Replit Integrations)
- **Google Gemini**: Form generation and AI suggestions (AI_INTEGRATIONS_GEMINI_API_KEY, AI_INTEGRATIONS_GEMINI_BASE_URL)
- **OpenAI**: Speech-to-text transcription and image generation (AI_INTEGRATIONS_OPENAI_API_KEY, AI_INTEGRATIONS_OPENAI_BASE_URL)

### Database
- **PostgreSQL**: Primary data store (DATABASE_URL environment variable required)
- **Drizzle Kit**: Schema migrations via `npm run db:push`

### Authentication
- **Replit Auth**: OpenID Connect provider (ISSUER_URL, REPL_ID)
- **Session Secret**: Required for secure session cookies (SESSION_SECRET)

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `@tanstack/react-query`: Data fetching and caching
- `@radix-ui/*`: Accessible UI primitives
- `framer-motion`: Animations
- `@dnd-kit/*`: Drag and drop functionality
- `qrcode.react`: QR code generation for form sharing
- `xlsx`: Export submissions to Excel
- `zod`: Schema validation throughout the stack