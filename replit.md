# Suolingo

## Overview

Suolingo is a mobile-first Korean language study app built with Expo/React Native, designed to help students prepare for the Korean CSAT (수능/Suneung) exam. The app focuses on Korean literature study with quiz-based learning featuring O/X (true/false) questions on literary passages (poetry and novels). It has a Duolingo-inspired UI with an orange color scheme, animated cheetah mascot, progress tracking, streak system, and XP rewards.

The project uses a full-stack architecture: an Expo React Native frontend (supporting iOS, Android, and web) with an Express.js backend server, PostgreSQL database via Drizzle ORM, and file-based routing through expo-router.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Expo SDK 54 with React Native 0.81, using the new architecture (`newArchEnabled: true`)
- **Routing**: expo-router v6 with file-based routing and typed routes. Tab navigation with three tabs (Home, Study, Profile) and stack screens for study flows (literature → quiz → result)
- **State Management**: React Context (`StudyContext`) for study progress, streaks, XP, and subcategory data. AsyncStorage for local persistence. TanStack React Query for server state management
- **Animations**: react-native-reanimated for UI animations (breathing mascot, press effects, confetti, progress bars, splash screen transitions)
- **Fonts**: Noto Sans KR (Korean font family) with Regular, Medium, Bold, and Black weights via @expo-google-fonts
- **UI Components**: Custom component library including CheetahMascot, ProgressBar, StudyCard, SubCategoryCard, SplashOverlay, ErrorBoundary
- **Haptic Feedback**: expo-haptics for tactile feedback on interactions
- **Platform Handling**: Cross-platform support (iOS, Android, Web) with platform-specific insets, keyboard handling (react-native-keyboard-controller), and conditional rendering

### Backend Architecture
- **Server**: Express.js v5 running on the same deployment, serves both the API and static web assets in production
- **API Pattern**: RESTful API with `/api` prefix. Routes registered in `server/routes.ts`. CORS configured for Replit domains and localhost development
- **Storage Layer**: Abstracted via `IStorage` interface in `server/storage.ts`. Currently uses in-memory storage (`MemStorage`) but designed for easy swap to database-backed implementation
- **Build Pipeline**: Separate build processes - `expo:static:build` for web assets via custom `scripts/build.js`, `server:build` via esbuild for server bundling

### Database
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` - currently has a `users` table with id (UUID), username, and password fields
- **Validation**: drizzle-zod for schema-to-Zod validation (insertUserSchema)
- **Migrations**: Drizzle Kit configured to output to `./migrations` directory. Push with `npm run db:push`
- **Connection**: Uses `DATABASE_URL` environment variable

### Quiz/Content System
- **Data Source**: Quiz content is statically defined in `data/quizData.ts` with TypeScript interfaces
- **Content Structure**: QuizPassages contain literary passages with metadata (title, author, category) and arrays of O/X (true/false) QuizQuestions with explanations
- **Categories**: Modern Poetry (현대시), Modern Novel (현대소설), Classic Poetry (고전시가), Classic Novel (고전소설)
- **Study Flow**: Study tab → Literature subcategories → Quiz with passage reading → O/X answers → Result screen with score

### Shared Code
- The `shared/` directory contains code shared between frontend and backend (schema definitions, types)
- Path aliases configured: `@/*` maps to project root, `@shared/*` maps to `./shared/*`

### Development Workflow
- **Dev Mode**: Two processes needed - `expo:dev` for the Expo dev server and `server:dev` for the Express backend (via tsx)
- **Production**: Static web build served by Express server. Server bundled with esbuild
- **Proxy**: `http-proxy-middleware` used in development to proxy between Expo and Express
- **Patches**: `patch-package` runs on postinstall for any necessary dependency patches

## External Dependencies

### Core Services
- **PostgreSQL Database**: Required via `DATABASE_URL` environment variable. Used with Drizzle ORM for data persistence
- **Replit Hosting**: Deployment configured for Replit with environment variables like `REPLIT_DEV_DOMAIN`, `REPLIT_DOMAINS`, `REPLIT_INTERNAL_APP_DOMAIN`

### Key NPM Packages
- **expo** (~54.0.27): Core framework for cross-platform mobile/web development
- **express** (^5.0.1): Backend HTTP server
- **drizzle-orm** (^0.39.3) + **drizzle-kit**: Database ORM and migration tooling
- **pg** (^8.16.3): PostgreSQL client driver
- **@tanstack/react-query** (^5.83.0): Server state management and caching
- **react-native-reanimated** (~4.1.1): High-performance animations
- **expo-router** (~6.0.17): File-based navigation
- **@react-native-async-storage/async-storage** (2.2.0): Local data persistence
- **expo-haptics** (~15.0.8): Haptic feedback
- **expo-linear-gradient** (~15.0.8): Gradient UI elements
- **zod** + **drizzle-zod**: Runtime validation