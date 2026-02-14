import { useState, useMemo } from 'react'
import {
  AmanhecerGradient,
  AmanhecerLight,
  AmanhecerSplit,
  MinimalDark,
  MinimalBright,
  ElectricAsymmetric,
  TexturaVintage,
  ArtisanClean,
  WarmFade,
  AuroraGlass,
  CrystalClear,
  VibrantCards
} from './themes'
import './themes/themes.css'

// Array com todos os 12 temas disponíveis
const allThemes = [
  AmanhecerGradient,
  AmanhecerLight,
  AmanhecerSplit,
  MinimalDark,
  MinimalBright,
  ElectricAsymmetric,
  TexturaVintage,
  ArtisanClean,
  WarmFade,
  AuroraGlass,
  CrystalClear,
  VibrantCards
]

// Função para selecionar tema aleatório
const getRandomTheme = () => {
  const randomIndex = Math.floor(Math.random() * allThemes.length)
  return allThemes[randomIndex]
}

function App() {
  // Seleciona um tema aleatório APENAS no carregamento inicial
  // A cada refresh, um novo tema será escolhido
  const RandomTheme = useMemo(() => getRandomTheme(), [])

  return <RandomTheme />
}

export default App

