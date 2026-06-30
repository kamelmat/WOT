@REM Apache Maven Wrapper startup script for Windows
@echo off
setlocal

set BASE_DIR=%~dp0

if not exist "%BASE_DIR%\.mvn\wrapper\maven-wrapper.jar" (
  javac "%BASE_DIR%\.mvn\wrapper\MavenWrapperDownloader.java"
  java -cp "%BASE_DIR%\.mvn\wrapper" MavenWrapperDownloader "%BASE_DIR%"
)

java -jar "%BASE_DIR%\.mvn\wrapper\maven-wrapper.jar" %*

