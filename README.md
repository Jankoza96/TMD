# TMD - Task Management Dashboard

A modern, responsive task management dashboard built with React, TypeScript, and Vite.

For detailed information about the architecture, design decisions, and implementation details, see [DOCUMENTATION.txt](./DOCUMENTATION.txt).

## Prerequisites

- Node.js (v20.19+ or v22.12+)
- npm or yarn

## Getting Started

1. **Clone the repository:**

```bash
git clone <repository-url>
cd "dual soft"
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start the JSON Server** (in a separate terminal):

```bash
npm run server
```

This will start the mock backend server on `http://localhost:3001`

4. **Start the development server:**

```bash
npm run dev
```

This will start the Vite development server on `http://localhost:5173`

5. **Open your browser** and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start JSON Server on port 3001
- `npm run lint` - Run ESLint

## Important Notes

- **JSON Server must be running** before starting the development server, as the app depends on it for data operations.
- The JSON Server runs on port 3001, while the Vite dev server runs on port 5173.
- Make sure both servers are running simultaneously for the application to work properly.
