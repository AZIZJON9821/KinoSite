# KINOSITE - Premium Movie Streaming Frontend

A production-ready movie streaming frontend built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **State Management**: Zustand + TanStack React Query
- **Authentication**: NextAuth (Google OAuth)
- **HTTP Client**: Axios

## Prerequisites
- Node.js 18+
- Backend API running (NestJS)

## Setup Instructions

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3000

    # Next Auth
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your_super_secret_key_here

    # Google OAuth (Get these from Google Cloud Console)
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `/app` - Pages and Layouts (App Router)
- `/components` - Reusable UI and Feature components
- `/hooks` - Custom React hooks (Data fetching, logic)
- `/lib` - Utilities and Configurations (Axios, Query Client)
- `/store` - Zustand stores
- `/types` - TypeScript interfaces
- `/styles` - Global styles

## Features
- **Authentication**: Google Login via NextAuth.
- **Movies**: Browse, Filter, Search, and Infinite Scroll (ready for implementation).
- **Player**: Custom HTML5 Video Player with overlay controls.
- **Design**: "Dark Cinema" theme inspired by Netflix.
