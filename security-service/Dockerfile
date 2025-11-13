# ---- Build stage ----
FROM gradle:8.10.2-jdk21 AS builder
WORKDIR /app

# Leverage layer caching for dependencies
COPY build.gradle settings.gradle ./
COPY gradle gradle
RUN gradle --no-daemon help || true

# Increase Gradle network timeouts (ms) to be resilient on slow networks
ENV GRADLE_OPTS "-Dorg.gradle.internal.http.connectionTimeout=60000 -Dorg.gradle.internal.http.socketTimeout=60000"

# Copy the rest of the source and build a fat jar
COPY . .
RUN gradle --no-daemon clean bootJar

# ---- Run stage ----
FROM eclipse-temurin:21-jre
WORKDIR /app

# Container-friendly JVM defaults
ENV JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75 -Djava.security.egd=file:/dev/./urandom"

# Copy the built artifact
COPY --from=builder /app/build/libs/*.jar /app/app.jar

# Spring Boot default port
EXPOSE 8080

# Allow overriding Spring properties via environment
ENV SPRING_PROFILES_ACTIVE=default

# Start the service
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
