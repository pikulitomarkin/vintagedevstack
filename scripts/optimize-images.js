#!/usr/bin/env node

/**
 * Script de otimização automática de imagens
 * Uso: node scripts/optimize-images.js
 * 
 * Processa todas as imagens em "img temas" e gera versões otimizadas:
 * - WebP (multiple sizes)
 * - AVIF (multiple sizes)
 * - JPEG otimizado (fallback)
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Configuração
const INPUT_DIR = path.join(__dirname, '..', 'img temas');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'optimized');

const SIZES = [
  { width: 768, suffix: '-mobile', quality: 80 },
  { width: 1024, suffix: '-tablet', quality: 82 },
  { width: 1920, suffix: '-desktop', quality: 85 },
  { width: 2560, suffix: '-large', quality: 85 }
];

// Cores para console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function optimizeImage(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  const results = [];

  log(`\n📸 Processando: ${filename}`, 'blue');

  for (const size of SIZES) {
    try {
      // WebP
      const webpPath = path.join(outputDir, `${filename}${size.suffix}.webp`);
      await sharp(inputPath)
        .resize(size.width, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: size.quality })
        .toFile(webpPath);
      
      const webpStats = await fs.stat(webpPath);
      results.push(`   WebP ${size.width}w: ${(webpStats.size / 1024).toFixed(1)}KB`);

      // AVIF
      const avifPath = path.join(outputDir, `${filename}${size.suffix}.avif`);
      await sharp(inputPath)
        .resize(size.width, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .avif({ quality: size.quality - 5 })
        .toFile(avifPath);
      
      const avifStats = await fs.stat(avifPath);
      results.push(`   AVIF ${size.width}w: ${(avifStats.size / 1024).toFixed(1)}KB`);

      // JPEG (fallback)
      const jpegPath = path.join(outputDir, `${filename}${size.suffix}.jpg`);
      await sharp(inputPath)
        .resize(size.width, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({ quality: size.quality, mozjpeg: true })
        .toFile(jpegPath);
      
      const jpegStats = await fs.stat(jpegPath);
      results.push(`   JPEG ${size.width}w: ${(jpegStats.size / 1024).toFixed(1)}KB`);

    } catch (error) {
      log(`   ❌ Erro no tamanho ${size.width}w: ${error.message}`, 'red');
    }
  }

  log(`✅ ${filename} concluído:`, 'green');
  results.forEach(r => log(r, 'yellow'));
}

async function processAll() {
  log('\n🚀 Iniciando otimização de imagens...', 'blue');
  log(`   Origem: ${INPUT_DIR}`, 'yellow');
  log(`   Destino: ${OUTPUT_DIR}\n`, 'yellow');

  try {
    // Criar diretório de saída
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Listar imagens
    const files = await fs.readdir(INPUT_DIR);
    const images = files.filter(f => /\.(png|jpe?g)$/i.test(f));

    if (images.length === 0) {
      log('⚠️  Nenhuma imagem encontrada em "img temas/"', 'yellow');
      return;
    }

    log(`📁 Encontradas ${images.length} imagens\n`, 'blue');

    // Processar cada imagem
    for (const image of images) {
      await optimizeImage(path.join(INPUT_DIR, image), OUTPUT_DIR);
    }

    // Resumo
    log('\n' + '='.repeat(50), 'green');
    log(`🎉 Processamento concluído!`, 'green');
    log(`   ${images.length} imagens otimizadas`, 'green');
    log(`   ${images.length * SIZES.length * 3} arquivos gerados`, 'green');
    log('='.repeat(50) + '\n', 'green');

    // Calcular tamanho total
    const allFiles = await fs.readdir(OUTPUT_DIR);
    let totalSize = 0;
    for (const file of allFiles) {
      const stats = await fs.stat(path.join(OUTPUT_DIR, file));
      totalSize += stats.size;
    }

    log(`💾 Tamanho total otimizado: ${(totalSize / 1024 / 1024).toFixed(2)}MB\n`, 'blue');

  } catch (error) {
    log(`\n❌ Erro durante o processamento: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Executar
if (require.main === module) {
  processAll();
}

module.exports = { optimizeImage, processAll };