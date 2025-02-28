# Project Brief

## Overview
Firstly, build a set of beautiful and engaging UI components which based on shadcn-ui but add some extra features and styling that i want that can be used across multiple projects. 

## Core Features
- Reusable components:
  - Button (should have waving animation)
  - Input (should have glowing animation when hover/focus)
  - Select (should have animation when open/close, should have a search bar, and should be responsive (sheet/dropdown))
  - Multi-select (should be responsive (sheet/dropdown), handle cases such as rendering a large number of options and scroll infinitely)
  - Modal (should have animation when open/close)
  - Table (should have sorting server, pagination, and filtering, should be responsive, sticky column by action, and should have a fixed header, sortable row, and selectable row)
  - Tabs (vercel style)
  - Toggle theme (use svg transition between light and dark theme)
- Hooks:
  - use-warning-out-form.ts (should have a warning message as a toast to confirm that whether user wants to leave the page)
- Hosting: 
  - Vercel
  - Self hosted via docker


## Target Users
- For only me, but i want to share it with other developers
- My plan is i will use this as a template for my own projects

## Technical Preferences (optional)
- Next.js 15 with App Router 
- TypeScript for type safety
- @tanstack/react-query for data fetching 
- Tailwind CSS for styling 
- React Hook Form with Zod validation 
- Base url for alias paths is "~/", can reference the tsconfig.json file for paths
- Tech constraints:
  - Must maintain TypeScript type safety
  - Follow existing architectural patterns: 
  - API routes under app/api/\
  - Services layer for business logic 
  - @tanstack/react-query for data fetching and caching
  - Import paths must remain exactly as written (no modifications)