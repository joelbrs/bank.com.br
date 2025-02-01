FROM openjdk:21-jdk AS build

WORKDIR /app

COPY mvnw ./
COPY .mvn ./.mvn
COPY pom.xml ./
COPY src ./src

RUN chmod +x ./mvnw

RUN ./mvnw clean package -DskipTests

FROM openjdk:21-jdk

WORKDIR /app

COPY --from=build /app/target/ms-authentication-0.0.1-SNAPSHOT.jar /app/Application.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "/app/Application.jar"]