# Builds the Spring Boot API from app/ — works when Render root is the repo root.
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY app/mvnw app/pom.xml ./
COPY app/.mvn .mvn
RUN chmod +x mvnw
COPY app/src ./src
RUN ./mvnw -q -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
ENV SPRING_PROFILES_ACTIVE=prod
COPY --from=build /app/target/fit-service-*.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
