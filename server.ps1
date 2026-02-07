# ONESEC Security Lab - Servidor HTTP con PowerShell
# Funciona en Windows 10/11 sin instalar nada adicional

$port = 8080
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# Tipos MIME para servir archivos correctamente
$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.png'  = 'image/png'
    '.gif'  = 'image/gif'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
    '.woff' = 'font/woff'
    '.woff2'= 'font/woff2'
    '.ttf'  = 'font/ttf'
    '.mp3'  = 'audio/mpeg'
    '.wav'  = 'audio/wav'
    '.mp4'  = 'video/mp4'
    '.webp' = 'image/webp'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://+:$port/")

try {
    $listener.Start()
} catch {
    # Si falla con +, intentar solo localhost
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
}

Write-Host ""
Write-Host "  ONESEC Lab Server corriendo en puerto $port" -ForegroundColor Green
Write-Host "  http://localhost:$port/index.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Presiona Ctrl+C para detener" -ForegroundColor Yellow
Write-Host ""

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq '/') { $urlPath = '/index.html' }

        $filePath = Join-Path $root ($urlPath -replace '/', '\')

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { 'application/octet-stream' }

            $response.ContentType = $contentType
            $response.StatusCode = 200

            # Headers CORS para compatibilidad
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Cache-Control", "no-cache")

            $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $fileBytes.Length
            $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)

            $status = "200"
            $color = "Green"
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 - No encontrado</h1><p>$urlPath</p>")
            $response.ContentType = 'text/html; charset=utf-8'
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)

            $status = "404"
            $color = "Red"
        }

        Write-Host "  [$status] $urlPath" -ForegroundColor $color
        $response.OutputStream.Close()
    }
} finally {
    $listener.Stop()
    Write-Host "`n  Servidor detenido." -ForegroundColor Yellow
}
