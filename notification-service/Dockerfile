# ==========================================
# STAGE 1: Build 'bookfair-contracts' (Gradle)
# ==========================================
FROM gradle:8.4.0-jdk21 AS contracts-builder
WORKDIR /workspace

# 1. Copy ONLY the build.gradle and src folder
#    (We don't copy gradlew or settings.gradle because you don't have them)
COPY bookfair-contracts/build.gradle ./bookfair-contracts/build.gradle
COPY bookfair-contracts/src ./bookfair-contracts/src

# 2. Switch to the folder
WORKDIR /workspace/bookfair-contracts

# 3. Create a temporary settings.gradle so Gradle runs successfully
RUN echo "rootProject.name = 'bookfair-contracts'" > settings.gradle

# 4. Use the GLOBAL 'gradle' command (since there is no ./gradlew script)
RUN gradle publishToMavenLocal --no-daemon


# ==========================================
# STAGE 2: Build 'notification-service' (Maven)
# ==========================================
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app

# 1. Copy the .m2 repository from the gradle stage to the root user's .m2
#    This contains the 'bookfair-contracts' JAR we just built
COPY --from=contracts-builder /home/gradle/.m2 /root/.m2

# 2. Copy pom.xml
COPY notification-service/pom.xml .

# 3. Download dependencies (It will now find the contracts jar in local .m2)
RUN mvn dependency:go-offline -B

# 4. Copy source code
COPY notification-service/src ./src

# 5. Build the application
RUN mvn clean package -DskipTests


# ==========================================
# STAGE 3: Final Runtime Image
# ==========================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN apk add --no-cache curl

# Copy the built JAR from the Maven builder stage
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8092

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8092/actuator/health || exit 1

ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar", "app.jar"]