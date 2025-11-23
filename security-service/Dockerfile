# security-service/Dockerfile

# ---- Build stage ----
FROM gradle:8.4.0-jdk21 AS builder
WORKDIR /workspace

# 1. Copy the source code for both modules into distinct folders
COPY bookfair-contracts/ /workspace/bookfair-contracts/
COPY security-service/ /workspace/security-service/

# 2. CREATE a root settings.gradle file dynamically
# This "glues" the two modules together so Gradle can resolve the dependency.
RUN echo "rootProject.name = 'docker-build'" > settings.gradle && \
    echo "include 'bookfair-contracts'" >> settings.gradle && \
    echo "include 'security-service'" >> settings.gradle

# 3. Build the specific service
# Now we run the build from the root, targeting the security-service module.
RUN gradle :security-service:bootJar --no-daemon

# ---- Run stage ----
FROM eclipse-temurin:21-jre-alpine
RUN apk add --no-cache curl
WORKDIR /app
ENV JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75 -Djava.security.egd=file:/dev/./urandom"

# 4. Copy the JAR
# Note the path: it is now inside the subfolder 'security-service'
COPY --from=builder /workspace/security-service/build/libs/*.jar /app/app.jar

EXPOSE 8096
ENV SPRING_PROFILES_ACTIVE=default
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "curl", "-f", "http://localhost:8096/actuator/health" ]

ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar", "app.jar"]