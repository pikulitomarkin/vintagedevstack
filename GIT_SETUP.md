# Guia de Configuração Git

## 📋 Pré-requisitos

1. **Instalar Git** (se ainda não tiver):
   - Download: https://git-scm.com/download/win
   - Ou via winget: `winget install Git.Git`

2. **Configurar Git** (primeira vez):
   ```bash
   git config --global user.name "Seu Nome"
   git config --global user.email "seu-email@exemplo.com"
   ```

## 🚀 Configuração do Repositório

Execute os seguintes comandos no terminal na pasta do projeto:

```bash
# 1. Inicializar o repositório Git
git init

# 2. Adicionar o remote origin
git remote add origin https://github.com/pikulitomarkin/vintagedevstack.git

# 3. Adicionar todos os arquivos
git add .

# 4. Fazer o commit inicial
git commit -m "Initial commit: Vintage DevStack site institucional"

# 5. Renomear branch para main (se necessário)
git branch -M main

# 6. Fazer push para o repositório
git push -u origin main
```

## 📝 Comandos Úteis

### Verificar status
```bash
git status
```

### Adicionar arquivos específicos
```bash
git add arquivo.js
```

### Verificar remote configurado
```bash
git remote -v
```

### Fazer push de atualizações
```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

## 🔐 Autenticação

Se o GitHub solicitar autenticação:

1. **Personal Access Token (Recomendado)**:
   - Vá em: GitHub Settings > Developer settings > Personal access tokens
   - Crie um token com permissões `repo`
   - Use o token como senha ao fazer push

2. **Ou use SSH**:
   ```bash
   git remote set-url origin git@github.com:pikulitomarkin/vintagedevstack.git
   ```

## ⚠️ Nota

O arquivo `.gitignore` já está configurado para ignorar:
- `node_modules/`
- `dist/`
- Arquivos de log e temporários
- Arquivos do editor



