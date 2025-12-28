# Guia de Instalação - Vintage DevStack

## Pré-requisitos

Para rodar este projeto, você precisa ter o **Node.js** instalado (versão 18 ou superior).

### Instalando Node.js no Windows

1. **Baixe o Node.js:**
   - Acesse: https://nodejs.org/
   - Baixe a versão LTS (Long Term Support)
   - Execute o instalador `.msi`

2. **Verifique a instalação:**
   Abra um novo terminal PowerShell e execute:
   ```powershell
   node --version
   npm --version
   ```

3. **Se ainda não funcionar após instalar:**
   - Feche e reabra o terminal
   - Reinicie o computador (às vezes necessário para atualizar o PATH)

## Instalando e Executando o Projeto

Após instalar o Node.js, execute os seguintes comandos no terminal:

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev
```

O servidor iniciará e você verá uma mensagem como:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Acesse `http://localhost:5173/` no seu navegador para ver o site.

## Comandos Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção

## Alternativa: Usando nvm (Node Version Manager)

Se preferir gerenciar múltiplas versões do Node.js:

1. Instale o nvm-windows: https://github.com/coreybutler/nvm-windows
2. Instale o Node.js via nvm:
   ```powershell
   nvm install 18
   nvm use 18
   ```

