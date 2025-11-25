# STAGE 1: Build 'reservation-service' (Gradle)
FROM gradle:8.4.0-jdk21 AS builder

WORKDIR /workspace

# Copy ALL necessary Gradle files
# Copy files from the 'reservation-service' directory
COPY reservation-service/gradlew /workspace/
COPY reservation-service/gradle/ /workspace/gradle/
COPY reservation-service/settings.gradle /workspace/

# Copy the source code for the modules we need
# We need both the app and its library dependency
COPY bookfair-contracts/ /workspace/bookfair-contracts/
COPY reservation-service/ /workspace/reservation-service/

# Make gradlew executable
RUN chmod +x ./gradlew

# Build the reservation-service.
# Gradle is smart and will build :bookfair-contracts first as a dependency.
RUN --mount=type=cache,target=/home/gradle/.gradle ./gradlew :reservation-service:bootJar --no-daemon


# STAGE 2: Create final lightweight Java 21 runtime image
FROM eclipse-temurin:21-jre-alpine

# Install curl for HEALTHCHECK
RUN apk add --no-cache curl

WORKDIR /app

# This port MUST match your reservation-service's port
EXPOSE 8085

# Copy the built JAR from the 'builder' stage
COPY --from=builder /workspace/reservation-service/build/libs/*.jar app.jar

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8085/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar", "app.jar"]