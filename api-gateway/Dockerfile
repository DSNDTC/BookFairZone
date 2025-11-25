# STAGE 1: Build api-gateway (Gradle)
FROM gradle:8.4.0-jdk21 AS builder

WORKDIR /workspace

# --- STEP 1: Build and Publish Shared Library ---
# Copy library files
COPY bookfair-contracts/build.gradle ./bookfair-contracts/
COPY bookfair-contracts/src ./bookfair-contracts/src

# Switch to library folder
WORKDIR /workspace/bookfair-contracts

# Create temp settings and publish to local maven (inside the container)
RUN echo "rootProject.name = 'bookfair-contracts'" > settings.gradle
RUN gradle publishToMavenLocal --no-daemon

# --- STEP 2: Build API Gateway ---
# Switch to gateway folder
WORKDIR /workspace/api-gateway

# Copy Gateway build files
COPY api-gateway/settings.gradle .
COPY api-gateway/build.gradle .

# Copy Gateway source
COPY api-gateway/src ./src

# Build the application using the GLOBAL gradle command
# (No need for ./gradlew or chmod)
RUN gradle bootJar --no-daemon

# STAGE 2: Create final lightweight Java 21 runtime image
FROM eclipse-temurin:21-jre-alpine

# Install curl for HEALTHCHECK
RUN apk add --no-cache curl

WORKDIR /app

# Ensure this matches your application.properties server.port
EXPOSE 8090

# Copy the built JAR from the correct path
COPY --from=builder /workspace/api-gateway/build/libs/*.jar app.jar

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8090/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]