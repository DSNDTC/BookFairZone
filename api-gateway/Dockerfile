# STAGE 1: Build api-gateway (Gradle)
FROM gradle:8.4.0-jdk21 AS builder

WORKDIR /workspace

# Copy Gradle wrapper and settings
COPY api-gateway/gradlew /workspace/
COPY api-gateway/gradle/ /workspace/gradle/
COPY api-gateway/settings.gradle /workspace/
COPY api-gateway/build.gradle /workspace/

# Copy source code
COPY api-gateway/src /workspace/src

# Make gradlew executable
RUN chmod +x ./gradlew

# Build the application
RUN ./gradlew bootJar --no-daemon

# STAGE 2: Create final lightweight Java 21 runtime image
FROM eclipse-temurin:21-jre-alpine

# Install curl for HEALTHCHECK
RUN apk add --no-cache curl

WORKDIR /app

# API Gateway runs on port 8080
EXPOSE 9090

# Copy the built JAR from the 'builder' stage
COPY --from=builder /workspace/build/libs/*.jar app.jar

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:9090/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
