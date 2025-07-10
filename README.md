# DCFM360 Frontend

This is the frontend application for DCFM360, built with Next.js.

## Getting Started

### Prerequisites

- Node.js 14.6.0 or newer
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

2. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. Open [http://localhost:3001](http://localhost:3001) in your browser to see the application.

## Configuration

The frontend is configured to connect to the backend API running on port 3000 through:
- Environment variables in `.env.local`:
  - `NEXT_PUBLIC_BACKEND_URL`: URL of the backend API (default: http://localhost:3000)
- API proxy configuration in `next.config.js`

## Features

- Modern React with Next.js
- TypeScript support
- API proxy to backend service

## Connection with Backend

The frontend communicates with the backend (running on port 3000) through:
- API routes in the `/pages/api` directory that proxy requests to the backend
- Direct API calls using the proxy configured in `next.config.js`
