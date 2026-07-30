export default class GameOver extends Phaser.Scene {
  constructor() {
    super('gameoverscene')
  }

  create() {
    const { width, height } = this.scale
    const version = this.registry.get('metalVersion') || 1

    this.add.sprite(width * 0.5, height * 0.5, 'gameover5').play('background_gameover').setDisplaySize(width, height)

    this.add.text(width * 0.5, height * 0.22, version === 3 ? 'METAL SLUG 3' : 'METAL SLUG', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: version === 3 ? '#7CFF6B' : '#FFE566',
    }).setOrigin(0.5)

    this.add.text(width * 0.5, height * 0.34, 'You DIED!', {
      fontSize: '52px',
      color: '#ff0000',
    }).setOrigin(0.5)

    const button = this.add.rectangle(width * 0.5, height * 0.55, 150, 75, 0xffffff)
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.scene.start('playscene')
      })

    this.add.text(button.x, button.y, 'Play Again', {
      color: '#000000',
    }).setOrigin(0.5)

    const menu = this.add.rectangle(width * 0.5, height * 0.72, 150, 40, 0x222222)
      .setStrokeStyle(1, 0x9fefc0)
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.scene.start('titlescene')
      })

    this.add.text(menu.x, menu.y, 'Menu', {
      color: '#9fefc0',
      fontFamily: 'monospace',
    }).setOrigin(0.5)
  }
}
