@echo off
echo ======================================
echo YouTube Clip Sequencer - Setup Script
echo ======================================
echo.

echo Installing project dependencies...
echo This may take a few minutes...
echo.

npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies
    echo.
    echo Please try running this command manually:
    echo npm install
    echo.
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!
echo.
echo To start the development server, run:
echo npm run dev
echo.
echo Then open your browser to: http://localhost:3000
echo.

pause
