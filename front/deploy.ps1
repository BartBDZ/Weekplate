# Navigate to the Angular project folder
cd "C:\Users\barto\Documents\Projekty\Weekplate\front"

Write-Host "1️⃣ Building Angular..."
ng build --configuration production --base-href /Weekplate/

# Paths
$buildFolder = "dist\weekplate\browser"
$publicFolder = "public"

# Copy public folder into the build output
if (Test-Path $publicFolder) {
    Write-Host "2️⃣ Copying public folder into build output..."
    Copy-Item "$publicFolder\*" $buildFolder -Recurse -Force
}

# Navigate to the build output folder
cd $buildFolder

# Git commit and push
Write-Host "3️⃣ Initializing git (if needed)..."
if (-not (Test-Path ".git")) {
    git init
    git branch -M gh-pages
    git remote add origin https://github.com/BartBDZ/Weekplate.git
} else {
    Write-Host "Git repository already exists, skipping init..."
}

Write-Host "4️⃣ Staging files..."
git add .

Write-Host "5️⃣ Committing changes..."
git commit -m "Deploy Angular build + assets" -q

Write-Host "6️⃣ Pushing to gh-pages..."
git push -f origin gh-pages

Write-Host "Deploy finished! The site should be available at: https://BartBDZ.github.io/Weekplate/"