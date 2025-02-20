# Task Management App (Frontend)

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Setup Instructions](#setup-instructions)
5. [Software and Hardware Requirements](#software-and-hardware-requirements)
6. [Connecting to Backend](#connecting-to-backend)
7. [Build for Production](#build-for-production)
8. [Folder Structure](#folder-structure)
9. [Deployment](#deployment)
10. [Contributing](#contributing)

## Overview

The Task Management App frontend is built using **React.js**, providing a user-friendly interface to manage tasks efficiently. Users can add, edit, delete, and filter tasks based on priority. The app supports dark mode and persists data using **localStorage** while fetching data from a backend API.

## Folder Structure

```
Client/
├── node_modules/            # Dependencies
├── public/                  # Static assets
├── src/                     # Source files
│   ├── components/          # Reusable UI components
│   │   ├── Tasks.css        # Styles for tasks
│   │   ├── Tasks1.jsx       # Additional task component
│   ├── App.jsx              # Main React component
│   ├── index.css            # Global styles
│   ├── main.jsx             # Entry point
├── .gitignore               # Git ignore file
├── eslint.config.js         # ESLint configuration
├── index.html               # HTML template
├── package-lock.json        # Dependency lock file
├── package.json             # Project configuration
├── README.md                # Project documentation
├── vite.config.js           # Vite configuration
```

## Features

- Add, edit, and delete tasks
- Mark tasks as complete
- Filter tasks by priority
- Dark mode toggle
- Persistent storage with localStorage
- Fetch tasks from backend API

## Setup Instructions

### 1. Prerequisites

Ensure you have **Node.js** and **npm** (or **yarn**) installed.

### 2. Clone the Repository

```sh
git clone <repository_url>
cd task-management-frontend
```

### 3. Install Dependencies

```sh
npm install  # or yarn install
```

### 4. Configure Environment Variables (Optional)

Create a `.env` file in the project root to store environment variables.

```
REACT_APP_API_URL=http://localhost:5000
```

### 5. Start the Development Server

```sh
npm start  # or yarn start
```

The app will be available at `http://localhost:3000/`.

## Software and Hardware Requirements

### Software Requirements

- **Operating System:** Windows, macOS, or Linux
- **Node.js:** v14 or later
- **Package Manager:** npm or yarn
- **Code Editor:** VS Code (recommended)

### Hardware Requirements

- **Processor:** Intel i3 or higher
- **RAM:** Minimum 4GB (8GB recommended)
- **Storage:** At least 500MB of free space

## Connecting to Backend

Ensure the backend is running at `http://localhost:5000`. If needed, update `REACT_APP_API_URL` in the `.env` file.

## Build for Production

```sh
npm run build  # or yarn build
```

This generates a production-ready build in the `build/` directory.


## Deployment

To deploy the app, use any static hosting provider (e.g., Vercel, Netlify, GitHub Pages).

## Contributing

Feel free to fork the repo, create a branch, and submit a pull request with improvements!

