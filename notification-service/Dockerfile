# ==========================================
# STAGE 1: Build Shared Library (Gradle)
# ==========================================
FROM gradle:8.4.0-jdk21 AS contracts-builder

WORKDIR /workspace

# Copy library files (assuming build context is root of monorepo)
COPY bookfair-contracts/build.gradle ./bookfair-contracts/
COPY bookfair-contracts/src ./bookfair-contracts/src

# Switch to library folder
WORKDIR /workspace/bookfair-contracts

# Create temp settings to allow standalone build
RUN echo "rootProject.name = 'bookfair-contracts'" > settings.gradle

# Publish to local Maven repository inside this container (custom path to avoid home dir/volume issues)
RUN gradle publishToMavenLocal --no-daemon -Dmaven.repo.local=/workspace/.m2

# ==========================================
# STAGE 2: Build 'notification-service' (Maven)
# ==========================================
FROM maven:3.9.6-eclipse-temurin-21 AS notification-builder
WORKDIR /app

COPY --from=contracts-builder /workspace/.m2 /root/.m2/repository

# 2. Copy pom.xml
COPY notification-service/pom.xml .

RUN mvn dependency:go-offline -B || true

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
COPY --from=notification-builder /app/target/*.jar app.jar

EXPOSE 8092

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8092/actuator/health || exit 1

ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar", "app.jar"]