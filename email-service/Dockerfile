# # STAGE 1: Build api-gateway (Gradle)
# FROM gradle:8.4.0-jdk21 AS builder

# WORKDIR /workspace

# # --- STEP 1: Build and Publish Shared Library ---
# # Copy library files
# COPY bookfair-contracts/build.gradle ./bookfair-contracts/
# COPY bookfair-contracts/src ./bookfair-contracts/src

# # Switch to library folder
# WORKDIR /workspace/bookfair-contracts

# # Create temp settings and publish to local maven (inside the container)
# RUN echo "rootProject.name = 'bookfair-contracts'" > settings.gradle
# RUN gradle publishToMavenLocal --no-daemon


# STAGE 1: Build 'bookfair-contracts' (Gradle)
FROM gradle:8.4.0-jdk21 AS contracts-builder

USER root

WORKDIR /workspace

COPY bookfair-contracts/ /workspace/bookfair-contracts/

WORKDIR /workspace/bookfair-contracts

RUN gradle publishToMavenLocal --no-daemon -Dmaven.repo.local=/workspace/repository

FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /app

COPY --from=contracts-builder /workspace/repository /root/.m2/repository

COPY email-service/pom.xml ./pom.xml
RUN mvn dependency:go-offline -B

COPY email-service/src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine

RUN apk add --no-cache curl

WORKDIR /app

EXPOSE 8081

COPY --from=builder /app/target/*.jar app.jar


HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8081/actuator/health || exit 1

ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar", "app.jar"]