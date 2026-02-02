# Spring Boot + React Starter Kit

A modern full-stack web application template with Spring Boot backend and React frontend, featuring authentication, file uploads, and containerized deployment.

![Preview of the application UI with a user logged in.](./_docs/app-preview.png)

## Features

- JWT authentication with OAuth2 (GitHub & Google)
- User registration, email verification, password reset
- User profile management with avatar upload (Google Cloud Storage)
- Dark/light theme support
- Fully containerized with Docker Compose

## Tech Stack

| Layer | Technology |
| ------ | ------------ |
| **Backend** | Spring Boot 4, Java 21, PostgreSQL |
| **Frontend** | React 19, TypeScript, Tailwind CSS, Vite |
| **Infrastructure** | Docker Compose, Google Cloud Storage |

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Java 21 (for local development)
- Node.js 22+ (for local development)

### Using Docker (Recommended)

1. Clone and start:

   ```bash
   git clone https://github.com/RianNegreiros/spring-react-starter-kit.git
   cd spring-react-starter-kit
   docker compose -f infra/docker-compose.yml up
   ```

2. Access:
   - Frontend: <http://localhost:5173>
   - Backend API: <http://localhost:8080>
   - Database: localhost:5432
   - MailHog (Email testing): <http://localhost:8025>

### Local Development

**Backend:**

```bash
cd backend && ./mvnw spring-boot:run
```

**Frontend:**

```bash
cd frontend && npm install && npm run dev
```

**Database & Mail service:**

```bash
docker compose -f infra/docker-compose.yml postgres mailhog
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

### Email Endpoints

- `POST /api/email/verify-email` - Verify email address with verification code
- `POST /api/email/resend-verification-code` - Resend email verification code

### Password Reset Endpoints

- `POST /api/user/password/forgot` - Request password reset
- `POST /api/user/password/validate-code` - Validate reset code
- `POST /api/user/password/reset` - Reset password with code

## Configuration

### Google Cloud (for Avatar Upload)

1. Create a [Google Cloud project](https://console.cloud.google.com/)
2. Enable Cloud Storage API and create a bucket
3. Install [Google Cloud CLI](https://docs.cloud.google.com/sdk/docs/install-sdk)
4. Run: `gcloud auth application-default login`

### OAuth2 Setup

**GitHub:**

- Go to Settings > Developer settings > OAuth Apps > New OAuth App
- Homepage: `http://localhost:5173` | Callback: `http://localhost:8080/login/oauth2/code/github`

**Google:**

- [Google Cloud Console](https://console.cloud.google.com/) > APIs & Services > Credentials > Create OAuth 2.0
- Redirect URI: `http://localhost:8080/login/oauth2/code/google`

### Backend Configuration

Update `backend/src/main/resources/application.properties`:

```properties
app.frontend.url=http://localhost:5173

# OAuth2
spring.security.oauth2.client.registration.github.client-id=YOUR_ID
spring.security.oauth2.client.registration.github.client-secret=YOUR_SECRET
spring.security.oauth2.client.registration.google.client-id=YOUR_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_SECRET

# GCP
gcp.project-id=your-project-id
gcp.bucket-name=your-bucket-name

# Database (use 'localhost' for local dev)
spring.datasource.url=jdbc:postgresql://postgres:5432/backend_db
```
