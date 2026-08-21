Add-Type -AssemblyName System.Drawing

$src = "c:\Users\Emps95\Desktop\stronagithub\Nekrovia.github.io\images"
$thumbDir = Join-Path $src "historia\thumbs"
$fullDir = Join-Path $src "historia\full"

$files = Get-ChildItem -Path $src -Filter "Zrzut ekranu*.png" | Sort-Object LastWriteTime

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)

function Resize-Save($srcPath, $destPath, $maxWidth, $quality) {
    $img = [System.Drawing.Image]::FromFile($srcPath)
    try {
        $ratio = [Math]::Min(1.0, $maxWidth / $img.Width)
        $w = [int]($img.Width * $ratio)
        $h = [int]($img.Height * $ratio)
        $bmp = New-Object System.Drawing.Bitmap($w, $h)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.DrawImage($img, 0, 0, $w, $h)
        $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int64]$quality)
        $bmp.Save($destPath, $jpegCodec, $encParams)
        $g.Dispose()
        $bmp.Dispose()
    } finally {
        $img.Dispose()
    }
}

$i = 1
$manifest = @()
foreach ($f in $files) {
    $name = "{0:D3}" -f $i
    $thumbPath = Join-Path $thumbDir "$name.jpg"
    $fullPath = Join-Path $fullDir "$name.jpg"
    Resize-Save $f.FullName $thumbPath 480 72
    Resize-Save $f.FullName $fullPath 1600 80
    $manifest += [PSCustomObject]@{ index = $name; date = $f.LastWriteTime.ToString("yyyy-MM-dd"); original = $f.Name }
    Write-Output "$name <- $($f.Name) ($($f.LastWriteTime.ToString('yyyy-MM-dd')))"
    $i++
}

$manifest | ConvertTo-Json | Set-Content -Path (Join-Path $src "historia\manifest.json") -Encoding utf8
Write-Output "DONE: $($files.Count) files processed"
