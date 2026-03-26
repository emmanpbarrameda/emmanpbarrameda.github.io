@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"
title Frontend Build + GitHub Pages Prep

:again
cls
echo ===========================================================
echo   Frontend Build Toolkit
echo   Folder: %cd%
echo ===========================================================
echo.

echo [1/2] Building frontend...
call npm run build

echo.
echo [2/2] Disabling Jekyll on GitHub Pages...
if not exist dist mkdir dist
echo.>dist\.nojekyll

echo.
echo ===========================================================
echo   Done!
echo ===========================================================
echo.
choice /M "Run the build again?" /C YN
if errorlevel 2 goto done
goto again

:done
echo.
echo All done. Press any key to close...
pause >nul
endlocal