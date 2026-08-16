# Social Intranet Portal Application

A comprehensive internal portal application for company-wide information sharing, knowledge management, and employee communication.

## Features

- **User Authentication**: JWT-based authentication with role-based access control (RBAC)
- **Dashboard**: Centralized view with announcements, Q&A, and quick links
- **Announcements**: Company-wide news and notifications with read tracking
- **Q&A System**: Employee knowledge sharing and problem-solving forum
- **Surveys**: Internal surveys and polls with real-time results
- **Employee Directory**: Organization structure and employee profiles
- **Role Management**: Flexible role and permission system for access control
- **Admin Panel**: Content and user management with audit logging

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router v6

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend development)
- Maven 3.8+ (for local backend development)
- JDK 17+

### Quick Start with Docker Compose

```bash
# Clone the repository
git clone https://github.com/himehamaki/portal.git
cd portal

# Start all services
docker-compose up -d

# Backend will be available at http://localhost:8080
# Frontend will be available at http://localhost:5173
```

### Local Development Setup

#### Backend

```bash
# Start PostgreSQL
docker-compose up -d postgres

# Build and run Spring Boot
mvn clean install
mvn spring-boot:run
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Default Test Users

| User Code | Password | Role | Email |
|-----------|----------|------|-------|
| admin001 | password123 | System Admin | admin@company.com |
| user001 | password123 | General User | yamada.taro@company.com |
| user002 | password123 | PR Staff | sato.hanako@company.com |
| user003 | password123 | General User | suzuki.jiro@company.com |

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/me` - Get current user info
- `GET /api/users` - List all users (admin only)
- `GET /api/users/{id}` - Get user by ID

### Roles
- `GET /api/roles` - List all roles
- `GET /api/roles/{id}` - Get role by ID

### Health
- `GET /health` - Health check

## Project Structure

```
.
├── src/
│   ├── main/
│   │   ├── java/com/company/portal/
│   │   │   ├── controller/       # REST API endpoints
│   │   │   ├── service/          # Business logic
│   │   │   ├── entity/           # JPA entities
│   │   │   ├── repository/       # Data access layer
│   │   │   ├── security/         # JWT & security config
│   │   │   ├── config/           # Spring configuration
│   │   │   ├── dto/              # Request/Response DTOs
│   │   │   └── PortalApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── pages/                # Page components
│   │   ├── services/             # API services
│   │   ├── hooks/                # Custom React hooks
│   │   ├── context/              # Context providers
│   │   ├── types/                # TypeScript types
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── db/
│   └── init.sql                  # Database schema
├── pom.xml
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Development Roadmap

### Phase 1 (Current)
- ✅ User authentication with JWT
- ✅ Role and permission management structure
- ✅ Basic API endpoints
- 🔄 React frontend with login and dashboard

### Phase 2
- Announcements CRUD
- Q&A system implementation
- Survey functionality
- Admin dashboard

### Phase 3
- Employee directory
- Organization charts
- Advanced search
- Audit logging

## Security Considerations

- All passwords are hashed with BCrypt
- JWT tokens expire after 24 hours
- CORS is configured for specific origins
- SQL injection is prevented by using JPA parameterized queries
- CSRF protection is enabled
- HTTPS/TLS should be enforced in production

## Database Schema

The application uses the following main tables:
- `users` - User accounts
- `roles` - Permission roles
- `permissions` - Individual permissions
- `user_roles` - User to role mapping
- `groups` - User groups
- `user_groups` - User to group mapping
- `announcements` - News and announcements
- `qa_questions` - Q&A forum entries
- `categories` - Content categories

## Configuration

Key configuration properties in `application.properties`:

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/portal
spring.datasource.username=portal_user
spring.datasource.password=portal_password

# JWT
jwt.secret=your-secret-key
jwt.expiration=86400000

# CORS
spring.security.cors.allowed-origins=http://localhost:5173
```

## License

Copyright © 2026 Your Company Name. All rights reserved.
