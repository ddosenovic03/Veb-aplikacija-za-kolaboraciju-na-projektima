# Project Collaboration Platform - Frontend

This directory contains the React frontend for the Project Collaboration Platform bachelor's thesis project.

The frontend provides the user interface for authentication, project collaboration, task management, invitations, comments, attachments, and progress tracking.

## Technologies

- React
- TypeScript
- React Router
- Axios
- Vite
- ESLint

## Structure

```text
src/
├── api          # API communication and Axios client
├── components   # Reusable UI and layout components
├── context      # Shared application and authentication state
├── pages        # Application pages grouped by feature
├── routes       # Protected and public-only route handling
├── types        # Shared TypeScript types
└── utils        # Shared helper functions
```

## Routing

The application uses React Router and separates public and protected routes.

Public routes include login and registration, while authenticated users can access the dashboard, projects, invitations, tasks, comments, and related project functionality.

## API Communication

API requests are handled through a shared Axios client.

The client automatically attaches the stored JWT token to authenticated requests and clears local authentication data when the API returns an unauthorized response.

The backend API URL can be configured using Vite environment variables. If no custom URL is provided, the frontend uses the local backend at:

```text
http://localhost:3000/api
```

## Running the Frontend

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application is available by default at:

```text
http://localhost:5173
```

Create a production build with:

```bash
npm run build
```

Run ESLint with:

```bash
npm run lint
```

For complete project setup instructions, database configuration, test accounts, architecture, and backend details, see the [main project README](../README.md).
