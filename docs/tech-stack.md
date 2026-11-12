# Technology Stack

## Frontend

1. Use G2FW custom pages for UI development
2. Custom pages developed using React 17 and TypeScript (4.x)
3. Prioritize using @g2fw/components for components; if unclear, call g2fw-doc to view component descriptions
4. Use G2FW functionality for multi-language support, handled by @g2fw/i18n package
5. Frontend build environment uses Node.js ≥20

## Backend

1. Java 21 (LTS), leveraging modern features like Virtual Threads and Records
2. Spring Boot 3.2.x or higher version
3. Gradle (Groovy) as build tool
4. Unit testing and integration testing: JUnit 5 + Mockito
5. API documentation handled with Swagger/OpenAPI
6. Use Vault for DB connection credential management
7. Log collection using Log4j2, logs collected to Graylog for centralized log management
8. Security authentication using Spring Security with JWT
9. Future deployment to k8s, need health check endpoints, use Spring Boot Actuator

## Database

- Database uses PostgreSQL 15 or higher version
