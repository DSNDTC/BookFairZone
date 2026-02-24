# BookFairZone 📚

BookFairZone is a comprehensive microservices-based platform designed to manage book fair stalls, user reservations, and notifications. Built with modern technologies, it offers a scalable and robust architecture for handling heavy traffic and complex business workflows.

## 🚀 Technologies Used

- **Frontend**: React, Vite, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Java 21, Spring Boot, Spring Cloud Gateway, Spring Security
- **Databases**: PostgreSQL, MySQL
- **Message Broker**: Apache Kafka, Zookeeper
- **Infrastructure**: Docker, Docker Compose

## 🏗️ Architecture (C4 Model)

The system architecture is designed using the C4 model for visualizing software architecture. Below are the Context and Container diagrams using Mermaid.

### 1. System Context Diagram

The System Context diagram shows the BookFairZone system in its environment, interacting with users and external systems.

```mermaid
C4Context
    title System Context diagram for BookFairZone

    Person(user, "User", "A customer or administrator interacting with the BookFairZone platform.")
    System(bookFairZone, "BookFairZone System", "Allows users to view stalls, make reservations, and manage their profiles.")

    System_Ext(emailSystem, "SendGrid Email System", "External system for sending email notifications to users.")

    Rel(user, bookFairZone, "Uses", "HTTPS")
    Rel(bookFairZone, emailSystem, "Sends emails using", "SMTP/API")
    Rel(emailSystem, user, "Delivers emails to")
```

### 2. Container Diagram

The Container diagram zooms into the BookFairZone System, showing the high-level technical building blocks (microservices, databases, and message brokers).

```mermaid
C4Container
    title Container diagram for BookFairZone System

    Person(user, "User", "A customer or administrator")

    System_Boundary(c1, "BookFairZone") {
        Container(spa, "Single-Page Application", "React, TypeScript, Vite", "Provides the user interface for administrators and customers.")

        Container(apiGateway, "API Gateway", "Spring Cloud Gateway, Java 21", "Routes incoming requests to the appropriate microservices and handles CORS.")

        Container(securityService, "Security Service", "Spring Boot, Java 21", "Handles user authentication and JWT token generation.")
        Container(userService, "User Service", "Spring Boot, Java 21", "Manages user profiles and information.")
        Container(reservationService, "Reservation Service", "Spring Boot, Java 21", "Handles stall reservations and emits events.")
        Container(stallService, "Stall Service", "Spring Boot, Java 21", "Manages stall details, pricing, and availability.")

        Container(notificationService, "Notification Service", "Spring Boot, Java 21", "Consumes events and processes notifications.")
        Container(emailService, "Email Service", "Spring Boot, Java 21", "Consumes events and dispatches emails.")

        ContainerDb(postgresDb, "PostgreSQL Database", "PostgreSQL 15", "Stores user, security, and reservation data.")
        ContainerDb(mysqlDb, "MySQL Database", "MySQL 8.0", "Stores stall data.")

        ContainerQueue(kafka, "Message Broker", "Apache Kafka", "Handles asynchronous event-driven communication (e.g., reservation.confirmed.events).")
    }

    System_Ext(emailSystem, "SendGrid Email System", "External email provider")

    Rel(user, spa, "Visits", "HTTPS")
    Rel(spa, apiGateway, "Makes API calls to", "JSON/HTTPS")

    Rel(apiGateway, securityService, "Routes auth requests to", "HTTP")
    Rel(apiGateway, userService, "Routes user requests to", "HTTP")
    Rel(apiGateway, reservationService, "Routes reservation requests to", "HTTP")
    Rel(apiGateway, stallService, "Routes stall requests to", "HTTP")

    Rel(securityService, postgresDb, "Reads/Writes", "JDBC")
    Rel(userService, postgresDb, "Reads/Writes", "JDBC")
    Rel(reservationService, postgresDb, "Reads/Writes", "JDBC")
    Rel(stallService, mysqlDb, "Reads/Writes", "JDBC")

    Rel(reservationService, kafka, "Publishes events to", "TCP")
    Rel(kafka, emailService, "Consumes events from", "TCP")
    Rel(kafka, notificationService, "Consumes events from", "TCP")

    Rel(emailService, emailSystem, "Sends emails via", "SMTP/API")
```

## 🛠️ Project Structure

- `api-gateway/`: Spring Cloud Gateway for routing requests.
- `security-service/`: Authentication and JWT token management.
- `user-service/`: User profile and identity management.
- `reservation-service/`: Core logic for booking and reservations.
- `stall-service/`: Manages stalls data.
- `notification-service/`: Listens to Kafka topics for system notifications.
- `email-service/`: Listens to Kafka topics and sends out emails via SendGrid.
- `bookfair-contracts/`: Shared DTOs and interfaces.
- `frontend/`: React SPA containing the UI.
- `docker-compose.yml`: Local full-stack infrastructure setup (Kafka, Zookeeper, Microservices, DBs).

## 🐳 Running Locally

1. **Prerequisites**: Ensure you have [Docker](https://www.docker.com/) and Docker Compose installed.
2. **Environment Variables**: Make sure to configure the root `.env` file with necessary secrets (e.g., Database credentials, JWT Secret, SendGrid API keys).
3. **Start the Infrastructure and Services**:
   ```bash
   docker-compose up --build -d
   ```
4. **Access the application**:
   - Frontend: `http://localhost:3000`
   - API Gateway: `http://localhost:8080`
   - Kafka UI: `http://localhost:8095`

## 🧪 Development

Each service can be developed and run independently. Ensure that the required infrastructure (PostgreSQL, MySQL, Kafka) is running via Docker before starting individual Spring Boot applications from your IDE.
