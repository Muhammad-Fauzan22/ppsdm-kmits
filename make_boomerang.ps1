$imagesDir = "A_seamless_hypnotic_1080p_202601282032_000"
$outputFile = "public/assets/videos/hero_boomerang.mp4"
$listFile = "frames.txt"

# Ensure output directory exists
New-Item -ItemType Directory -Force -Path "public/assets/videos"

# Get all images
$images = Get-ChildItem -Path $imagesDir -Filter "*.jpg" | Sort-Object Name

# Create frames list (Forward)
$content = @()
foreach ($img in $images) {
    if ($img.Name -match "000.jpg|0[0-7][0-9].jpg") { # Limit to valid range if needed, here we take all
       $path = "$imagesDir/" + $img.Name
       $path = $path -replace "\\", "/"
       $content += "file '$path'"
       $content += "duration 0.04" # ~25fps
    }
}

# Create frames list (Backward) - skip last to avoid double frame, skip first to avoid double frame at loop point if desired
for ($i = $images.Count - 2; $i -ge 1; $i--) {
    $img = $images[$i]
     $path = "$imagesDir/" + $img.Name
     $path = $path -replace "\\", "/"
     $content += "file '$path'"
     $content += "duration 0.04"
}

# Write file
$content | Out-File -Encoding ASCII $listFile

# Run ffmpeg
# -f concat -safe 0 -i frames.txt -c:v libx264 -pix_fmt yuv420p output.mp4
ffmpeg -f concat -safe 0 -i $listFile -c:v libx264 -pix_fmt yuv420p -y $outputFile

Write-Host "Video created at $outputFile"
