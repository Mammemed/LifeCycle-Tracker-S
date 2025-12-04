# Script PowerShell pour démarrer les deux serveurs
Write-Host "🚀 Démarrage de LifeCycle Tracker..." -ForegroundColor Green
Write-Host ""

# Démarrer le backend dans une nouvelle fenêtre
Write-Host "📡 Démarrage du backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev"

# Attendre un peu avant de démarrer le frontend
Start-Sleep -Seconds 3

# Démarrer le frontend dans une nouvelle fenêtre
Write-Host "🎨 Démarrage du frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host ""
Write-Host "✅ Les deux serveurs sont en cours de démarrage dans des fenêtres séparées" -ForegroundColor Green
Write-Host "📡 Backend: http://localhost:5000" -ForegroundColor Yellow
Write-Host "🎨 Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Appuyez sur une touche pour fermer cette fenêtre..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

