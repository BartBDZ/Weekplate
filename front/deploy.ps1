# Przejdź do folderu projektu Angular
cd "C:\Users\barto\Documents\Projekty\Weekplate\front"

Write-Host "1️⃣ Budowanie Angulara..."
ng build --configuration production --base-href /Weekplate/

# Ścieżki
$buildFolder = "dist\weekplate\browser"
$publicFolder = "public"

# Skopiuj public do builda
if (Test-Path $publicFolder) {
    Write-Host "2️⃣ Kopiowanie folderu public do builda..."
    Copy-Item "$publicFolder\*" $buildFolder -Recurse -Force
}

# Przejdź do folderu builda
cd $buildFolder

# Git commit i push
Write-Host "3️⃣ Inicjalizacja gita (jeśli potrzebne)..."
if (-not (Test-Path ".git")) {
    git init
    git branch -M gh-pages
    git remote add origin https://github.com/BartBDZ/Weekplate.git
} else {
    Write-Host "Repozytorium git już istnieje, pomijam init..."
}

Write-Host "4️⃣ Dodawanie plików do commita..."
git add .

Write-Host "5️⃣ Commit zmian..."
git commit -m "Deploy Angular build + assets" -q

Write-Host "6️⃣ Wypychanie na gh-pages..."
git push -f origin gh-pages

Write-Host "✅ Deploy zakończony! Strona powinna być dostępna pod: https://BartBDZ.github.io/Weekplate/"