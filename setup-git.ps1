# Script de Configuração Git para Vintage DevStack
# Execute este script após instalar o Git

Write-Host "🚀 Configurando Git para Vintage DevStack..." -ForegroundColor Cyan

# Verificar se Git está instalado
try {
    $gitVersion = git --version
    Write-Host "✅ Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale o Git primeiro: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Verificar se já é um repositório Git
if (Test-Path .git) {
    Write-Host "⚠️  Repositório Git já inicializado" -ForegroundColor Yellow
    $continue = Read-Host "Deseja continuar mesmo assim? (s/n)"
    if ($continue -ne "s") {
        exit 0
    }
} else {
    Write-Host "📦 Inicializando repositório Git..." -ForegroundColor Cyan
    git init
}

# Verificar remote origin
$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    Write-Host "⚠️  Remote 'origin' já existe: $remoteExists" -ForegroundColor Yellow
    $changeRemote = Read-Host "Deseja alterar para https://github.com/pikulitomarkin/vintagedevstack.git? (s/n)"
    if ($changeRemote -eq "s") {
        git remote set-url origin https://github.com/pikulitomarkin/vintagedevstack.git
        Write-Host "✅ Remote atualizado" -ForegroundColor Green
    }
} else {
    Write-Host "🔗 Adicionando remote origin..." -ForegroundColor Cyan
    git remote add origin https://github.com/pikulitomarkin/vintagedevstack.git
    Write-Host "✅ Remote adicionado" -ForegroundColor Green
}

# Adicionar arquivos
Write-Host "📝 Adicionando arquivos ao staging..." -ForegroundColor Cyan
git add .

# Verificar se há mudanças para commitar
$status = git status --porcelain
if ($status) {
    Write-Host "💾 Criando commit inicial..." -ForegroundColor Cyan
    git commit -m "Initial commit: Vintage DevStack site institucional com design blueprint industrial"
    Write-Host "✅ Commit criado" -ForegroundColor Green
} else {
    Write-Host "⚠️  Nenhuma mudança para commitar" -ForegroundColor Yellow
}

# Verificar branch atual
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "🌿 Renomeando branch para 'main'..." -ForegroundColor Cyan
    git branch -M main
    Write-Host "✅ Branch renomeada" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ Configuração concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Configure seu usuário Git (se ainda não fez):" -ForegroundColor Yellow
Write-Host "   git config --global user.name 'Seu Nome'" -ForegroundColor White
Write-Host "   git config --global user.email 'seu-email@exemplo.com'" -ForegroundColor White
Write-Host ""
Write-Host "2. Faça o push para o GitHub:" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Nota: Você precisará autenticar no GitHub (token ou SSH)" -ForegroundColor Yellow

