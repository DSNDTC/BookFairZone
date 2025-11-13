FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY stall-service/pom.xml .
COPY stall-service/mvnw .
COPY stall-service/mvnw.cmd .
COPY stall-service/.mvn .mvn
RUN mvn dependency:go-offline -B
COPY stall-service/src ./src
RUN mvn -DskipTests clean package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/stall-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
