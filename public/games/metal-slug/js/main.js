import BootGame from './scenes/BootGame.js'
import PlayGame from './scenes/PlayGame.js'
import GameOver from './scenes/GameOver.js'
import TitleGame from './scenes/TitleGame.js'

const params = new URLSearchParams(window.location.search)
const initialVersion = params.get('v') === '3' ? 3 : 1

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 700,
  height: 400,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 700,
    height: 400,
  },
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true,
  },
  fps: {
    target: 30,
  },
  scene: [BootGame, TitleGame, PlayGame, GameOver],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
}

const game = new Phaser.Game(config)
game.registry.set('metalVersion', initialVersion)
