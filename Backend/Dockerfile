# Use OpenJDK 17 as the base image
FROM openjdk:17-jdk-slim

# Argument for the jar file name
ARG JAR_FILE=target/ghbliArt-0.0.1-SNAPSHOT.jar

# Copy the jar file into the container
COPY ${JAR_FILE} app.jar

# Expose port 8080 (default Spring Boot port)
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java","-jar","/app.jar"]
