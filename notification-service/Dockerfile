# STAGE 1: Build 'bookfair-contracts' (Gradle)
# This stage builds the Gradle module and installs it into the container's
# local Maven repository (/root/.m2)
FROM gradle:8.4.0-jdk21 AS contracts-builder

WORKDIR /workspace

# --- THIS IS THE FIX ---
# Copy ALL necessary Gradle files from the root context
COPY gradlew /workspace/
COPY gradle/ /workspace/gradle/
COPY settings.gradle /workspace/
# Copy only the module we need to build
COPY bookfair-contracts/ /workspace/bookfair-contracts/
# --- END FIX ---

# Make the gradlew script (now at /workspace/gradlew) executable
RUN chmod +x ./gradlew

# Build and publish only the 'contracts' module to the local .m2 repo
# This task publishes to /home/gradle/.m2
RUN ./gradlew :bookfair-contracts:publishToMavenLocal --no-daemon


# STAGE 2: Build 'notification-service' (Maven)
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

# --- Process notification-service ---

# 1. CRITICAL: Copy the .m2 repo from the gradle user's home
COPY --from=contracts-builder /home/gradle/.m2 /root/.m2

# 2. Copy the notification-service pom and download dependencies
#    (This will now find bookfair-contracts in the copied .m2 repo)
COPY notification-service/pom.xml ./pom.xml
RUN mvn dependency:go-offline -B

# 3. Copy its source code
COPY notification-service/src ./src

# 4. Build and package the final application
RUN mvn clean package -DskipTests


# STAGE 3: Create final lightweight Java 21 runtime image
FROM eclipse-temurin:21-jre-alpine

# Install curl for HEALTHCHECK
RUN apk add --no-cache curl

WORKDIR /app

# This port MUST match your notification-service's port
EXPOSE 8083

# Copy the built JAR from the 'builder' stage
COPY --from=builder /app/target/*.jar app.jar

# Healthcheck to see if the Spring Boot app is ready
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8083/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar", "app.jar"]