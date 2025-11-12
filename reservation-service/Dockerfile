# Multi-stage build for Order Service (Gradle)

# Stage 1: Build
# Use a Gradle image with JDK 21
FROM gradle:8.4.0-jdk21 AS build

# Set working directory
WORKDIR /workspace

# Copy Gradle wrapper, build script, and settings script
# This allows downloading dependencies before copying source
COPY build.gradle settings.gradle ./
COPY gradlew gradlew.bat ./
COPY gradle ./gradle

# Make sure Gradle wrapper is executable
RUN chmod +x gradlew

# Download dependencies first for better caching
# Use --no-daemon to avoid a lingering daemon in the build layer
RUN ./gradlew dependencies --no-daemon

# Copy the source code
COPY src ./src

# Build the application (skip tests for faster builds)
# The --no-daemon flag is recommended for CI/container builds
RUN ./gradlew build --no-daemon -x test

# Stage 2: Production
FROM eclipse-temurin:21-jre-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup -g 1001 -S orderuser && adduser -u 1001 -S orderuser -G orderuser

# Set working directory
WORKDIR /app

# Copy the JAR file from build stage
# Gradle builds jars in build/libs
COPY --from=build /workspace/build/libs/*.jar app.jar

# Change ownership to non-root user
RUN chown orderuser:orderuser app.jar

# Switch to non-root user
USER orderuser

# Expose application port
EXPOSE 9094

# Health check (same as your Maven Dockerfile)
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:9094/actuator/health || exit 1

# Run the application with Docker profile (same as your Maven Dockerfile)
ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-Dspring.profiles.active=docker", "-jar", "/app/app.jar"]