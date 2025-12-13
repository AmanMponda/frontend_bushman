# Test CORS preflight request
# Run this to check if backend handles OPTIONS correctly

$url = "https://bushman-api.abooderp.com/api/v1.0/reportings/quota-stats/"
$headers = @{
    "Origin" = "https://your-frontend-domain.com"
    "Access-Control-Request-Method" = "GET"
    "Access-Control-Request-Headers" = "Content-Type, Authorization"
}

Write-Host "Testing OPTIONS request to: $url" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $url -Method OPTIONS -Headers $headers -ErrorAction Stop
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "CORS Headers:" -ForegroundColor Cyan
    $response.Headers | Format-Table
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        Write-Host "This indicates the backend is NOT handling OPTIONS correctly!" -ForegroundColor Yellow
    }
}

