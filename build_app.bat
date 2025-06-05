@echo off
echo ==========================================
echo   Building Room Management Application...
echo ==========================================

:: Navigate to backend and build it
cd backend
echo [INFO] Running Maven build for backend...
mvn clean install

if %errorlevel% neq 0 (
    echo [ERROR] Maven build failed. Exiting.
    pause
    exit /b %errorlevel%
)

:: Navigate back and into frontend
cd ..
cd frontend
echo [INFO] Running npm build for frontend...
npm run build

if %errorlevel% neq 0 (
    echo [ERROR] NPM build failed. Exiting.
    pause
    exit /b %errorlevel%
)

:: Back to root directory
cd ..

echo ==========================================
echo         Build process completed!
echo ==========================================
pause
