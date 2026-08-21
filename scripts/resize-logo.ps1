Add-Type -AssemblyName System.Drawing

$src = "c:\Users\Emps95\Desktop\stronagithub\Nekrovia.github.io\images\logo.png"
$out = "c:\Users\Emps95\Desktop\stronagithub\Nekrovia.github.io\images\logo-200.png"

$img = [System.Drawing.Image]::FromFile($src)
try {
    $size = 200
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $bmp.SetResolution($img.HorizontalResolution, $img.VerticalResolution)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.DrawImage($img, 0, 0, $size, $size)
    $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
} finally {
    $img.Dispose()
}
Write-Output "saved $out"
