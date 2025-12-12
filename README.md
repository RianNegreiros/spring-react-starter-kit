# Spring Boot + React Starter Kit

Full-stack web application with Spring Boot backend and React frontend.

## Tech Stack

**Backend:** Spring Boot 4, Java 21, PostgreSQL, JWT Auth, OAuth2  
**Frontend:** React, TypeScript, Tailwind CSS, Vite  
**Infrastructure:** Docker Compose

## Features

- User authentication (JWT + OAuth2)
- Avatar upload/management
- Docker containerization

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Java 21 (for local development)
- Node.js 22+ (for local development)

### Using Docker (Recommended)

1. Clone and start:

   ```bash
   git clone https://github.com/RianNegreiros/spring-react-starter-kit.git
   cd spring-react-starter-kit/infra
   docker-compose up -d
   ```

2. Access:
   - Frontend: <http://localhost:5173>
   - Backend API: <http://localhost:8080>
   - Database: localhost:5432

### Local Development

**Backend:**

```bash
cd backend && ./mvnw spring-boot:run
```

**Frontend:**

```bash
cd frontend && npm install && npm run dev
```

**Database:**

```bash
cd infra && docker-compose up postgres -d
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/current` - Get current user

### User Endpoints

- `PUT /api/user/profile` - Update user profile

### Avatar Endpoints

- `POST /api/avatar` - Upload user avatar (multipart/form-data)
- `DELETE /api/avatar` - Delete user avatar

## Configuration

### Environment Variables

#### Backend (`application.properties`)

```properties
# Frontend Configuration
app.frontend.url=http://localhost:5173

# Github Oauth2 Configuration
spring.security.oauth2.client.registration.github.client-id=your-client-id
spring.security.oauth2.client.registration.github.client-secret=your-client-secret
spring.security.oauth2.client.registration.github.scope=read:user,user:email

# Google OAuth2 Configuration
spring.security.oauth2.client.registration.google.client-id=your-client-id
spring.security.oauth2.client.registration.google.client-secret=your-client-secret

# Database (Postgres)
# Change 'postgres' to 'localhost' if using docker
spring.datasource.url=jdbc:postgresql://postgres:5432/backend_db
```
