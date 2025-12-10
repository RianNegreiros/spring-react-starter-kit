# Spring Boot + Next.js Starter Kit

A full-stack web application starter kit combining Spring Boot backend with Next.js frontend, featuring authentication and Docker containerization.

## Tech Stack

### Backend

- **Spring Boot 4** - Java framework
- **Java 21** - LTS version of Java
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Data persistence layer
- **PostgreSQL** - Primary database
- **Flyway** - Database migration tool
- **JWT** - Token-based authentication
- **Lombok** - Reduces boilerplate code
- **Maven** - Dependency management

### Frontend

- **Next.js 16** - React framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Shadcn/ui** - Modern UI components
- **Next Themes** - Dark/light mode support

### Infrastructure

- **Docker & Docker Compose** - Containerization

## Project Structure

```bash
spring-nextjs-start-kit/
├── backend/                 # Spring Boot application
│   ├── src/main/java/      # Java source code
│   │   └── br/com/riannegreiros/backend/
│   │       ├── config/     # Security & JWT configuration
│   │       ├── entity/     # JPA entities
│   │       ├── filters/    # Authentication filters
│   │       ├── users/      # User management module
│   │       └── util/       # Utilities & exception handling
│   ├── src/main/resources/ # Application properties & migrations
│   ├── pom.xml            # Maven dependencies
│   └── Dockerfile         # Backend container config
├── frontend/               # Next.js application
│   ├── app/               # App Router pages
│   ├── components/        # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities & context
│   ├── public/           # Static assets
│   ├── package.json      # Node.js dependencies
│   └── Dockerfile        # Frontend container config
├── infra/                # Infrastructure configuration
│   └── docker-compose.yml # Multi-container setup
└── README.md             # Project documentation
```

## 🛠️ Features

### Authentication & Security

- JWT-based authentication
- Cookie-based session management
- User registration and login
- Protected routes
- Spring Security integration
- Password validation

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Java 21 (for local development)
- Node.js 22+ (for local development)

### Using Docker (Recommended)

1. **Clone the repository**

   ```bash
   git clone https://github.com/RianNegreiros/spring-nextjs-start-kit.git
   cd spring-nextjs-start-kit
   ```

2. **Start all services**

   ```bash
   cd infra
   docker-compose up -d
   ```

3. **Access the applications**
   - Frontend: <http://localhost:3000>
   - Backend API: <http://localhost:8080>
   - Database: localhost:5432

### Local Development

#### Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

#### Database Setup

```bash
cd infra
docker-compose up postgres -d
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/current` - Get current user

## Configuration

### Environment Variables

#### Backend (`application.properties`)

```properties
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

#### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```
