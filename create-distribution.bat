@echo off
echo Creating Naxie Vanilla Distribution Package...
echo.

REM Build the package
echo Building main package...
call npm run build
echo Building standalone vanilla bundle...
call npx vite build --config vite.vanilla.config.ts

REM Create distribution folder
echo Creating distribution folder...
if not exist "dist-package" mkdir dist-package
if not exist "dist-package\vanilla" mkdir dist-package\vanilla

REM Copy vanilla files
xcopy /y "dist\vanilla\style.css" "dist\vanilla.css*"
echo Copying standalone vanilla files...
copy "dist-vanilla\naxie.mjs" "dist-package\vanilla\naxie.mjs"
copy "dist-vanilla\naxie.css" "dist-package\vanilla\naxie.css"

REM Copy documentation
echo Copying documentation...
copy "PRIVATE_DISTRIBUTION.md" "dist-package\README.md"

echo.
echo ✓ Distribution package created in 'dist-package' folder
echo.
echo Files included:
echo   - vanilla/naxie.mjs
echo   - vanilla/naxie.css
echo   - README.md
echo.
echo You can now share the 'dist-package' folder with authorized users.
echo.
pause
