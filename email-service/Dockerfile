# STAGE 1: Build 'bookfair-contracts' (Gradle)
# This stage builds the Gradle module and installs it into the container's
# local Maven repository (/root/.m2)
FROM gradle:8.4.0-jdk21 AS contracts-builder

WORKDIR /workspace

# Copy all Gradle files needed to run the build
COPY gradlew gradlew.bat ./
COPY gradle ./gradle
COPY settings.gradle build.gradle ./
COPY bookfair-contracts ./bookfair-contracts

# Run the 'publishToMavenLocal' task to build the JAR
# and put it in the local .m2 repository.
# We must run this from the root.
RUN ./gradlew :bookfair-contracts:publishToMavenLocal --no-daemon


# STAGE 2: Build 'email-service' (Maven)
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

# --- Process email-service ---

# 1. CRITICAL: Copy the local .m2 repo from the 'contracts-builder' stage.
# This makes the 'bookfair-contracts.jar' available to Maven.
COPY --from=contracts-builder /root/.m2 /root/.m2

# 2. Copy the email-service pom and download dependencies
#    (This will now find bookfair-contracts in the copied .m2 repo)
COPY email-service/pom.xml ./email-service/pom.xml
RUN mvn -f email-service/pom.xml dependency:go-offline -B

# 3. Copy its source code
COPY email-service/src ./email-service/src

# 4. Build and package the final application
RUN mvn -f email-service/pom.xml clean package -DskipTests


# STAGE 3: Create final lightweight Java 21 runtime image
FROM eclipse-temurin:21-jre-alpine

# Install curl, which is needed for the HEALTHCHECK
RUN apk add --no-cache curl

WORKDIR /app

# This port should match your email-service's port
EXPOSE 8083

# Copy the built JAR from the 'builder' stage
COPY --from=builder /app/email-service/target/*.jar app.jar

# Healthcheck to see if the Spring Boot app is ready
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8083/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar", "app.jar"]