/**
 * Corta os últimos N segundos de um vídeo usando ffprobe + ffmpeg.
 * Uso: node scripts/trim-video-last-seconds.js <arquivo> [segundos]
 * Padrão: 3 segundos
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static').path;

const videoPath = process.argv[2] || path.join(__dirname, '..', 'public', 'kling_20260218_Build_Avatar_Standing_c_3310_0.mp4');
const secondsToCut = parseInt(process.argv[3], 10) || 3;

if (!fs.existsSync(videoPath)) {
  console.error('Arquivo não encontrado:', videoPath);
  process.exit(1);
}

const videoDir = path.dirname(videoPath);
const videoExt = path.extname(videoPath);
const videoBase = path.basename(videoPath, videoExt);
const outputPath = path.join(videoDir, videoBase + '_trimmed' + videoExt);

// Obter duração com ffprobe (segundos, com decimais)
const probeOutput = execSync(
  `"${ffprobePath}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`,
  { encoding: 'utf-8', maxBuffer: 10 * 1024 }
).trim();
const totalSeconds = parseFloat(probeOutput);
const newDuration = Math.max(0, totalSeconds - secondsToCut);

if (newDuration <= 0) {
  console.error('O vídeo é mais curto que', secondsToCut, 'segundos. Nada a cortar.');
  process.exit(1);
}

console.log('Duração original:', totalSeconds.toFixed(2), 's');
console.log('Cortando últimos', secondsToCut, 's → nova duração:', newDuration.toFixed(2), 's');

// Cortar: -t = duração de saída (do início até newDuration)
execSync(
  `"${ffmpegPath}" -y -i "${videoPath}" -t ${newDuration} -c copy "${outputPath}"`,
  { stdio: 'inherit' }
);

// Substituir original pelo cortado
fs.renameSync(outputPath, videoPath);
console.log('Pronto. Vídeo atualizado:', videoPath);
