@echo off
echo Installing backend dependencies...
cd /d "%~dp0"
call npm install
echo.
echo Checking if bcryptjs is installed...
if exist "node_modules\bcryptjs\package.json" (
    echo ✅ bcryptjs is installed!
) else (
    echo ❌ bcryptjs NOT found - installing now...
    call npm install bcryptjs --save
)
echo.
echo Checking if jsonwebtoken is installed...
if exist "node_modules\jsonwebtoken\package.json" (
    echo ✅ jsonwebtoken is installed!
) else (
    echo ❌ jsonwebtoken NOT found - installing now...
    call npm install jsonwebtoken --save
)
echo.
echo ✅ Installation complete!
echo.
pause
