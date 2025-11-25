FROM maven:3.9.6-eclipse-temurin-21-alpine AS build

WORKDIR /app


COPY . /app/


RUN mvn clean package -DskipTests


FROM eclipse-temurin:21-jre-alpine


WORKDIR /app

EXPOSE 8096


COPY --from=build /app/target/*.jar user-service.jar


ENTRYPOINT ["java", "-jar", "user-service.jar"]