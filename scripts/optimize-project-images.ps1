Add-Type -AssemblyName System.Drawing

$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$imagesRoot = Join-Path $projectRoot 'projetos/images'
$outputRoot = Join-Path $imagesRoot 'otimizadas'
$jpegEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object MimeType -eq 'image/jpeg' |
    Select-Object -First 1

$items = @(
    @{ Name = 'Modelagem_P.png'; Max = 900; Quality = 88 },
    @{ Name = 'Rig_P.png'; Max = 900; Quality = 88 },
    @{ Name = '3DPrint_P.png'; Max = 900; Quality = 88 },
    @{ Name = 'Games_P.png'; Max = 900; Quality = 88 },
    @{ Name = 'Programacao_P.jpg'; Max = 900; Quality = 88 },
    @{ Name = 'Ensino_P.png'; Max = 900; Quality = 88 },
    @{ Name = 'Modelagem_G.png'; Max = 2200; Quality = 88 },
    @{ Name = 'Rig_G.png'; Max = 2200; Quality = 88 },
    @{ Name = '3DPrint_G.jpg'; Max = 2200; Quality = 88 },
    @{ Name = 'Games_G.jpg'; Max = 2200; Quality = 88 },
    @{ Name = 'Programacao_G.JPG'; Max = 2200; Quality = 88 },
    @{ Name = 'Ensino_G.png'; Max = 2200; Quality = 88 },
    @{ Name = 'Cards/LudoDigital_Card.jpg'; Max = 1400; Quality = 88 },
    @{ Name = 'Cards/CardGame_Card.jpg'; Max = 1400; Quality = 88 },
    @{ Name = 'Cards/Ebook_Card.jpg'; Max = 1400; Quality = 88 }
)

foreach ($item in $items) {
    $sourcePath = Join-Path $imagesRoot $item.Name
    $relativeOutput = [IO.Path]::ChangeExtension($item.Name, '.jpg')
    $outputPath = Join-Path $outputRoot $relativeOutput
    New-Item -ItemType Directory -Path (Split-Path $outputPath) -Force | Out-Null

    $source = [System.Drawing.Image]::FromFile($sourcePath)
    try {
        $scale = [math]::Min(1.0, $item.Max / [math]::Max($source.Width, $source.Height))
        $width = [math]::Max(1, [int][math]::Round($source.Width * $scale))
        $height = [math]::Max(1, [int][math]::Round($source.Height * $scale))
        $output = [System.Drawing.Bitmap]::new($width, $height, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
        try {
            $graphics = [System.Drawing.Graphics]::FromImage($output)
            try {
                $graphics.Clear([System.Drawing.Color]::Black)
                $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
                $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
                $graphics.DrawImage($source, 0, 0, $width, $height)
            } finally { $graphics.Dispose() }

            $parameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
            try {
                $parameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new(
                    [System.Drawing.Imaging.Encoder]::Quality, [long]$item.Quality)
                $output.Save($outputPath, $jpegEncoder, $parameters)
            } finally { $parameters.Dispose() }
        } finally { $output.Dispose() }
    } finally { $source.Dispose() }

    $before = (Get-Item -LiteralPath $sourcePath).Length
    $after = (Get-Item -LiteralPath $outputPath).Length
    [pscustomobject]@{
        Name = $item.Name
        OriginalMB = [math]::Round($before / 1MB, 2)
        OptimizedMB = [math]::Round($after / 1MB, 2)
        Pixels = "${width}x${height}"
    }
}
