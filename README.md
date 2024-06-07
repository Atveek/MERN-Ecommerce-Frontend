---

# eKart E-commerce Site 
<a href"https://mern-ekart-project.vercel.app/" target="_blank">eKart Link</a>

eKart is a full-stack e-commerce web application built using Node.js with Express.js for the backend and React.js for the frontend.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Setting Up Environment Variables](#setting-up-environment-variables)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: User registration, login, and authentication using JWT tokens.
- **Product Management**: CRUD operations for managing products, categories, and brands.
- **User Cart**: Add products to cart, update quantities, and checkout with payment integration.
- **Order Management**: View order history and status, update order details, and receive payment intents.
- **Email Notifications**: Send email notifications for order confirmations and updates.

## Technologies Used

### Backend

- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB**: NoSQL database for storing product, user, and order data.
- **Passport.js**: Authentication middleware for user authentication strategies.
- **Stripe**: Payment processing API for handling online payments.

### Frontend

- **React**: JavaScript library for building dynamic user interfaces.
- **Redux**: State management library for managing application state.
- **React Router**: Declarative routing for React applications.
- **Material-UI**: React components for faster and easier web development.
- **Axios**: Promise-based HTTP client for making requests to the backend API.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js
- MongoDB

### Installation

1. Clone the repository:

```bash
git clone [<repository-url>](https://github.com/Atveek/MERN-Ecommerce-Project.git)
```

2. Navigate to the project directory:

```bash
cd eKart
```

3. Install backend dependencies:

```bash
cd backend
npm install
```

4. Navigate to the frontend directory:

```bash
cd ../frontend
npm install
```

### Setting Up Environment Variables

1. Create a `.env` file in the backend directory:

```plaintext
touch .env
```

2. Add the following environment variables to the `.env` file:

```plaintext
PORT = 8080
MONGO_URL=<mongodb-connection-string>
JWT_SECRET_KEY=<jwt-secret-key>
STRIPE_SECRET_KEY=<stripe-secret-key>
ENDPOINT_URL=<stripe-endpoint-url>
SESSION_KEY=<session-secret-key>
MAIL_PASSWORD = <mail-password>
```

Replace `<mongodb-connection-string>`, `<jwt-secret-key>`, `<stripe-secret-key>`, `<stripe-endpoint-url>`,`<mail-password>`, and `<session-secret-key>` with your actual values.

### Running the Application

1. Start the backend server:

```bash
npm run dev
```

2. Start the frontend development server:

```bash
npm start
```

3. Access the application:

Open your web browser and navigate to `http://localhost:3000`.

## Project Structure

The project structure is organized as follows:

```
eKart/
│
├── backend/                 # Backend directory
│   ├── controller/          # MVC controller functions
│   ├── model/               # MVC data models
│   ├── routes/              # Express route handlers
│   ├── services/            # Helper functions and services
│   ├── .env                 # Environment variables
│   ├── index.js             # Backend server entry point
│   └── package.json         # Backend dependencies and scripts
│
└── frontend/                # Frontend directory
    ├── src/                 # Frontend source code
    │   ├── app/             # Main application component
    │   ├── features/        # Features/components
    │   ├── pages/           # Page components
    │   └── index.js         # Application entry point
    ├── public/              # Public assets and index.html
    └── package.json         # Frontend dependencies and scripts
```
