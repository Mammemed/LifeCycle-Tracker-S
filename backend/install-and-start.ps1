Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Installing Backend Dependencies..." -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Install all dependencies
Write-Host "Running npm install..." -ForegroundColor Yellow
npm install

# Verify bcryptjs installation
Write-Host ""
Write-Host "Verifying bcryptjs installation..." -ForegroundColor Yellow
if (Test-Path "node_modules\bcryptjs\package.json") {
    Write-Host "✅ bcryptjs is installed!" -ForegroundColor Green
} else {
    Write-Host "❌ bcryptjs NOT found - installing now..." -ForegroundColor Red
    npm install bcryptjs@2.4.3 --save
}

# Verify jsonwebtoken installation
Write-Host ""
Write-Host "Verifying jsonwebtoken installation..." -ForegroundColor Yellow
if (Test-Path "node_modules\jsonwebtoken\package.json") {
    Write-Host "✅ jsonwebtoken is installed!" -ForegroundColor Green
} else {
    Write-Host "❌ jsonwebtoken NOT found - installing now..." -ForegroundColor Red
    npm install jsonwebtoken@9.0.2 --save
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✅ Installation Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting server..." -ForegroundColor Yellow
Write-Host ""

# Start the server
npm run dev
