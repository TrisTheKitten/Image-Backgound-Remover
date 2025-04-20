@echo off
echo Testing Backend Server Connection
echo ==============================
echo.

echo Attempting to connect to http://localhost:5000/health
echo.

powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/health' -UseBasicParsing; if ($response.StatusCode -eq 200) { Write-Host 'SUCCESS: Backend is running correctly!' -ForegroundColor Green; Write-Host 'Response:' $response.Content } else { Write-Host 'ERROR: Backend returned unexpected status code:' $response.StatusCode -ForegroundColor Red } } catch { Write-Host 'ERROR: Cannot connect to backend server.' -ForegroundColor Red; Write-Host 'Make sure the backend_server.bat script is running.' -ForegroundColor Yellow }"

echo.
echo If you see connection errors:
echo 1. Make sure the backend_server.bat is running
echo 2. Check if port 5000 is available (not used by another application)
echo 3. Check for any firewall or antivirus blocking the connection
echo.
pause 