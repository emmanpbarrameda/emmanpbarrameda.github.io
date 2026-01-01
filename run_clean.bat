:: Frontend build
call npm run build

:: Disable Jekyll on GitHub Pages (important for /_astro)
if not exist dist mkdir dist
type nul > dist\.nojekyll

pause