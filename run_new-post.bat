@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM Use the folder where this BAT lives as the project root
set "ROOT=%~dp0"
REM Remove trailing backslash (optional)
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"

set "BLOG_DIR=%ROOT%\src\content\blog"
set "IMG_DIR=%ROOT%\public\blog-images"
set "VID_DIR=%ROOT%\public\blog-videos"

echo.
set /p "TITLE=Post title (e.g. hello world): "
if not defined TITLE (
  echo [ERROR] Title cannot be empty.
  pause
  exit /b 1
)

set /p "DESCRIPTION=Description: "
set /p "TAGS=Tags (comma-separated, e.g. javascript, web, tutorial): "

REM --- Format tags as YAML array ---
if defined TAGS (
  for /f "usebackq delims=" %%T in (`
    powershell -NoProfile -Command ^
      "$tags = '%TAGS%' -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' };" ^
      "'[' + ($tags -join ', ') + ']'"
  `) do set "TAGS_YAML=%%T"
) else (
  set "TAGS_YAML=[]"
)

REM --- Slugify via PowerShell (safe) ---
REM lowercases, converts non-alphanumerics to '-', trims '-' edges
for /f "usebackq delims=" %%S in (`
  powershell -NoProfile -Command ^
    "$t=$env:TITLE; if([string]::IsNullOrWhiteSpace($t)){exit 1};" ^
    "$s=$t.ToLowerInvariant();" ^
    "$s=[regex]::Replace($s,'[^a-z0-9]+','-');" ^
    "$s=$s.Trim('-');" ^
    "if([string]::IsNullOrWhiteSpace($s)){exit 1};" ^
    "$s"
`) do set "SLUG=%%S"

if not defined SLUG (
  echo [ERROR] Could not generate a slug from the title: "%TITLE%"
  pause
  exit /b 1
)

set "MD_FILE=%BLOG_DIR%\%SLUG%.md"
set "IMG_FOLDER=%IMG_DIR%\%SLUG%"
set "VID_FOLDER=%VID_DIR%\%SLUG%"

REM --- Date (yyyy-MM-dd) ---
for /f "usebackq delims=" %%D in (`powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"`) do set "TODAY=%%D"

REM --- Create folders ---
if not exist "%BLOG_DIR%" mkdir "%BLOG_DIR%"
if not exist "%IMG_DIR%" mkdir "%IMG_DIR%"
if not exist "%VID_DIR%" mkdir "%VID_DIR%"

if not exist "%IMG_FOLDER%" mkdir "%IMG_FOLDER%"
if not exist "%VID_FOLDER%" mkdir "%VID_FOLDER%"

REM --- Create MD (no overwrite) ---
if exist "%MD_FILE%" (
  echo.
  echo [ERROR] File already exists:
  echo   %MD_FILE%
  echo Aborting to avoid overwrite.
  pause
  exit /b 1
)

(
  echo ---
  echo title: "%TITLE%"
  echo description: "%DESCRIPTION%"
  echo pubDate: %TODAY%
  echo tags: %TAGS_YAML%
  echo draft: true
  echo cover:
  echo   src: "/blog-images/%SLUG%/cover.webp"
  echo   alt: "%TITLE%"
  echo ---
  echo.
  echo # %TITLE%
  echo.
  echo Write here...
) > "%MD_FILE%"

echo.
echo Done!
echo - slug: %SLUG%
echo - md:   %MD_FILE%
echo - imgs: %IMG_FOLDER%
echo - vids: %VID_FOLDER%
echo.

set /p "OPEN=Open the new file now? (Y/N): "
if /i "%OPEN%"=="Y" code "%MD_FILE%"

endlocal