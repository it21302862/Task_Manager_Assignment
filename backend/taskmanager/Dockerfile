# Step 1: Use a Maven image to build the project
FROM maven:3.9.2-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code
COPY src ./src

# Build the application (package jar)
RUN mvn clean package -DskipTests

# Step 2: Use a lightweight JDK image to run the app
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port (same as Spring Boot server port)
EXPOSE 9090

# Command to run the jar
ENTRYPOINT ["java","-jar","app.jar"]
