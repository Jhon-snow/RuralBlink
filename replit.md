# Overview

RuralCart is a mobile-first e-commerce application designed for rural grocery delivery. The application features a React frontend with a Node.js/Express backend, optimized for mobile grocery shopping with features like category browsing, cart management, order tracking, and SMS notifications. The architecture supports offline functionality and real-time order updates.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: Zustand for global state management with persistence
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **Data Fetching**: TanStack React Query for server state management and caching
- **Mobile-First Design**: Responsive layout with bottom navigation and floating cart

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Shared schema definitions between client and server using Drizzle-Zod
- **Development**: Hot module replacement with Vite integration
- **Storage**: In-memory storage implementation for development with interface for database integration

## Database Schema
- **Users**: Phone-based authentication with address storage
- **Categories**: Product categorization with slugs and images
- **Products**: Inventory management with pricing in paisa (Indian currency subunit)
- **Orders**: Complete order lifecycle tracking with JSON item storage

## Authentication & User Management
- **Phone-based Authentication**: Uses phone numbers as primary identifiers
- **User Profiles**: Simple profile management with delivery addresses
- **Session Management**: Stateful sessions with potential for database-backed storage

## Mobile Optimization
- **PWA Ready**: Service worker support and offline functionality
- **Touch Optimized**: Mobile-first UI with touch-friendly interactions
- **Performance**: Optimized for rural internet connections with caching strategies
- **Responsive Design**: Adapts to various screen sizes with mobile-first approach

## Development Environment
- **Build System**: Vite with TypeScript support and React plugins
- **Development Server**: Express with Vite middleware for HMR
- **Code Organization**: Monorepo structure with shared schemas and utilities
- **Error Handling**: Runtime error overlay for development debugging

# External Dependencies

## Database & ORM
- **Neon Database**: Serverless PostgreSQL database service (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe database toolkit with schema validation
- **PostgreSQL**: Primary database with support for JSON fields and UUID generation

## UI & Styling
- **Radix UI**: Comprehensive primitive component library for accessibility
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide Icons**: Consistent icon library for UI elements
- **Embla Carousel**: Touch-friendly carousel component for product displays

## State Management & Data Fetching
- **Zustand**: Lightweight state management with persistence middleware
- **TanStack React Query**: Server state management with caching and synchronization
- **React Hook Form**: Form handling with validation using Zod schemas

## Development & Build Tools
- **Vite**: Fast build tool with HMR and modern JavaScript features
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

## SMS & Communication Services
- **Twilio Integration**: SMS notification system for order updates (configured but not implemented)
- **Phone-based Communication**: Rural-friendly communication patterns

## Deployment & Production
- **Node.js**: Production runtime environment
- **Express.js**: Web server framework
- **Static File Serving**: Built-in static file serving for production builds