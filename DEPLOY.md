# Guia de Deploy no Railway

Este projeto está configurado para deploy automático no Railway.

## 📋 Pré-requisitos

1. Conta no Railway: https://railway.app
2. Git configurado (se usar deploy via Git)
3. Node.js 18+ (especificado no `.nvmrc`)

## 🚀 Deploy no Railway

### Opção 1: Deploy via GitHub/GitLab (Recomendado)

1. **Faça push do código para seu repositório:**
   ```bash
   git add .
   git commit -m "Preparado para deploy no Railway"
   git push origin main
   ```

2. **No Railway:**
   - Acesse https://railway.app
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha seu repositório
   - O Railway detectará automaticamente as configurações

3. **O Railway irá:**
   - Instalar dependências (`npm install`)
   - Executar o build (`npm run build`)
   - Iniciar o servidor (`npm start`)

### Opção 2: Deploy via Railway CLI

1. **Instale o Railway CLI:**
   ```bash
   npm i -g @railway/cli
   ```

2. **Faça login:**
   ```bash
   railway login
   ```

3. **Inicialize o projeto:**
   ```bash
   railway init
   ```

4. **Faça o deploy:**
   ```bash
   railway up
   ```

## ⚙️ Configurações

### Arquivos de Configuração

- **`railway.json`**: Configuração do Railway
- **`Procfile`**: Define o comando de start
- **`.nvmrc`**: Versão do Node.js (18)
- **`package.json`**: Scripts de build e start

### Variáveis de Ambiente

O Railway detecta automaticamente a porta através da variável `PORT`. Não é necessário configurar manualmente.

### Build e Start

- **Build**: `npm run build` - Gera os arquivos estáticos na pasta `dist/`
- **Start**: `npm start` - Inicia o servidor estático na porta configurada

## 🔍 Verificação

Após o deploy, o Railway fornecerá uma URL pública. Acesse para verificar se o site está funcionando corretamente.

## 📝 Notas

- O projeto usa Vite para build, gerando arquivos estáticos otimizados
- O servidor `serve` serve os arquivos da pasta `dist/`
- O Railway detecta automaticamente projetos Node.js
- A porta é configurada automaticamente pelo Railway

## 🐛 Troubleshooting

Se houver problemas:

1. Verifique os logs no dashboard do Railway
2. Certifique-se de que o build está gerando a pasta `dist/`
3. Verifique se a porta está sendo detectada corretamente
4. Confirme que todas as dependências estão no `package.json`



