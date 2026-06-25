# AI upscale a low-res video with Real-ESRGAN (4x) + ffmpeg encode.
# Usage: .\upscale-video.ps1 -InputVideo "..\assets\source.mp4" -OutputVideo "..\assets\output.mp4"

param(
  [Parameter(Mandatory = $true)]
  [string]$InputVideo,
  [Parameter(Mandatory = $true)]
  [string]$OutputVideo,
  [string]$Model = "realesrgan-x4plus",
  [int]$Scale = 4
)

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
$Work = Join-Path $PSScriptRoot "video-upscale"
$FramesIn = Join-Path $Work "frames_in"
$FramesOut = Join-Path $Work "frames_out"
$FramesJpg = Join-Path $Work "frames_jpg"
$RealEsrgan = Join-Path $PSScriptRoot "realesrgan-ncnn-vulkan\realesrgan-ncnn-vulkan.exe"

foreach ($dir in @($FramesIn, $FramesOut, $FramesJpg)) {
  if (Test-Path $dir) { Remove-Item $dir -Recurse -Force }
  New-Item -ItemType Directory -Path $dir | Out-Null
}

Write-Host "Extracting frames..."
ffmpeg -y -i $InputVideo -vf "hqdn3d=3:2:4:3" (Join-Path $FramesIn "frame_%05d.png") -loglevel error

Write-Host "Upscaling with Real-ESRGAN ($Model, ${Scale}x)..."
Push-Location (Split-Path $RealEsrgan)
& $RealEsrgan -i $FramesIn -o $FramesOut -n $Model -s $Scale -f png -j 2:4:4
Pop-Location

Write-Host "Converting to JPEG for faster encode..."
ffmpeg -y -i (Join-Path $FramesOut "frame_%05d.png") -qscale:v 2 (Join-Path $FramesJpg "frame_%05d.jpg") -loglevel error

Write-Host "Encoding final video..."
$rate = ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 $InputVideo
ffmpeg -y -framerate $rate -i (Join-Path $FramesJpg "frame_%05d.jpg") -i $InputVideo -map 0:v -map 1:a -c:v libx264 -crf 18 -preset veryfast -pix_fmt yuv420p -c:a copy -shortest $OutputVideo -loglevel error

Write-Host "Done: $OutputVideo"
ffprobe -v error -show_entries stream=width,height,bit_rate,duration -of default=noprint_wrappers=1 $OutputVideo
