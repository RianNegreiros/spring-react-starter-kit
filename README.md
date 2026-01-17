# Spring Boot + React Starter Kit

A modern full-stack web application template with Spring Boot backend and React frontend, featuring authentication, file uploads, and containerized deployment.

![Preview of the application UI with a user logged in.](./_docs/app-preview.png)

## Features

- **Authentication System**
  - JWT-based authentication
  - OAuth2 integration (GitHub & Google)
  - User registration and login
  - Protected routes and API endpoints

- **User Management**
  - User profile management
  - Avatar upload with Google Cloud Storage
  - Account settings

- **Modern Tech Stack**
  - Latest Spring Boot 4.0 with Java 21
  - React 19 with TypeScript
  - Tailwind CSS 4.x with shadcn/ui components
  - Vite for fast development builds

## Tech Stack

| Layer | Technology |
| ------ | ------------ |
| **Backend** | Spring Boot, Java 21, PostgreSQL |
| **Frontend** | React, TypeScript, Tailwind CSS, Vite |
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

- `POST /api/email/verify` - Verify email address with verification code
- `POST /api/email/resend-verification-code` - Resend email verification code

## Configuration

### Google Cloud Setup (Required for Avatar Upload)

**Prerequisites:**
Before setting up authentication, ensure you have:

1. **A Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Click "Select a project" → "New Project"
   - Give it a name (e.g., "my-app-project") and click "Create"
   - Note your Project ID (you'll need this later)

2. **Enable Cloud Storage API:**
   - In your project, go to "APIs & Services" → "Library"
   - Search for "Cloud Storage API"
   - Click "Enable"

3. **Create a Storage Bucket:**
   - Go to "Cloud Storage" → "Buckets"
   - Click "Create Bucket"
   - Choose a unique name and configure settings (location, storage class, etc.)
   - Click "Create"

4. **Set Up Permissions:**
   You need the following roles on your Google account:
   - **Storage Object Admin** (to upload/delete files) OR
   - **Storage Object Creator** (just to upload files)

**Authentication Setup:**

1. **Install Google Cloud CLI:**
   Follow the guide for your system: [Quickstart: Install the Google Cloud CLI](https://docs.cloud.google.com/sdk/docs/install-sdk)

2. **Set up Application Default Credentials:**

   ```bash
   gcloud auth application-default login
   ```

   This creates a credentials file that the Google SDK automatically uses:
   - Linux, macOS: `$HOME/.config/gcloud/application_default_credentials.json`
   - Windows: `%APPDATA%\gcloud\application_default_credentials.json`

3. **Set your default project (optional but recommended):**

   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

### OAuth2 Setup

#### GitHub OAuth App

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth App with:
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL: `http://localhost:8080/login/oauth2/code/github`
3. Copy Client ID and Client Secret

#### Google OAuth2

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google+ API
3. Create OAuth 2.0 credentials with:
   - Authorized redirect URI: `http://localhost:8080/login/oauth2/code/google`
4. Copy Client ID and Client Secret

### Environment Variables

#### Backend (`application.properties`)

```properties
# Frontend Configuration
app.frontend.url=http://localhost:5173

# Github Oauth2 Configuration
spring.security.oauth2.client.registration.github.client-id=your-github-client-id
spring.security.oauth2.client.registration.github.client-secret=your-github-client-secret
spring.security.oauth2.client.registration.github.scope=read:user,user:email

# Google OAuth2 Configuration
spring.security.oauth2.client.registration.google.client-id=your-google-client-id
spring.security.oauth2.client.registration.google.client-secret=your-google-client-secret

# GCP Configuration
gcp.project-id=your-project-id
gcp.bucket-name=your-bucket-name
gcp.avatar-folder=avatars/

# Database (Postgres)
# Change 'postgres' to 'localhost' if using docker
spring.datasource.url=jdbc:postgresql://postgres:5432/backend_db
```

## Project Structure

```bash
spring-react-starter-kit/
├── backend/                 # Spring Boot application
├── frontend/               # React application
│   ├── src/                # TypeScript/React source
├── infra/                  # Infrastructure configuration
│   └── docker-compose.yml  # Container orchestration
```
