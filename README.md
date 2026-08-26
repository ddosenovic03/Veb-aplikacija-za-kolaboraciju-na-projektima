# Project Collaboration Platform

A full-stack web application developed as my individual bachelor's thesis in
Software and Information Engineering.

The application is designed to support collaboration on projects by allowing
users to create projects, invite members, create and manage tasks, track task
progress, communicate through comments, and share file or link attachments.

## Features

- User registration and login
- JWT-based authentication
- Project creation and management
- Project member invitations and invitation responses
- Task creation and assignment
- Individual task progress tracking
- Project and task progress overview
- Public and private task comments
- File and link attachments
- User dashboard with relevant project and task information

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, TypeScript, React Router, Axios |
| Backend | Node.js, Express, TypeScript |
| Database | MySQL |
| Authentication | JWT, bcrypt |
| Validation | Zod |
| File Uploads | Multer |
| Development | Git, npm, Vite |

## Architecture

The application is divided into a React frontend, an Express REST API and a
MySQL relational database.

The backend follows a layered structure:

- **Routes** define API endpoints.
- **Controllers** handle HTTP requests and responses.
- **Services** contain application and database logic.
- **Validators** validate incoming data.
- **DTOs** define structured data returned by the API.
- **Middlewares** handle authentication and application errors.

The frontend separates pages, reusable components, API communication,
authentication state, routing and shared types.

## Database

The relational database models users, projects, project memberships, tasks,
task assignments, comments and attachments.

![ER diagram](docs/ER%20dijagram.png)

## Project Structure

```text
.
├── backend
│   ├── database
│   └── src
│       ├── config
│       ├── controllers
│       ├── dto
│       ├── middlewares
│       ├── routes
│       ├── services
│       ├── utils
│       └── validators
├── docs
└── frontend
    └── src
        ├── api
        ├── components
        ├── context
        ├── pages
        ├── routes
        ├── types
        └── utils
