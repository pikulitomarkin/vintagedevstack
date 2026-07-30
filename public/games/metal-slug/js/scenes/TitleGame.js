export default class TitleGame extends Phaser.Scene {
  constructor() {
    super('titlescene')
  }

  create() {
    const version = this.registry.get('metalVersion') || 1
    const { width, height } = this.scale

    const bg = this.add.image(0, 0, 'title').setOrigin(0)
    const scaleX = width / bg.width
    const scaleY = height / bg.height
    bg.setScale(Math.max(scaleX, scaleY))

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.45)

    const title = version === 3 ? 'METAL SLUG 3' : 'METAL SLUG'
    this.add.text(width / 2, height * 0.22, title, {
      fontFamily: 'monospace',
      fontSize: '42px',
      color: version === 3 ? '#7CFF6B' : '#FFE566',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5)

    this.add.text(width / 2, height * 0.34, 'SELECIONE / SELECT', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5)

    this.makeButton(width / 2, height * 0.52, 'METAL SLUG', () => {
      this.registry.set('metalVersion', 1)
      this.scene.start('playscene')
    }, version === 1)

    this.makeButton(width / 2, height * 0.68, 'METAL SLUG 3', () => {
      this.registry.set('metalVersion', 3)
      this.scene.start('playscene')
    }, version === 3)

    this.add.text(width / 2, height * 0.88, '← → mover  ·  ESPAÇO pular  ·  A atirar  ·  ↓ agachar', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#9fefc0',
    }).setOrigin(0.5)

    // auto-start if opened with ?v= and user presses any key after short delay
    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('playscene')
    })
  }

  makeButton(x, y, label, onClick, selected) {
    const w = 260
    const h = 44
    const fill = selected ? 0x1a5c3a : 0x111111
    const stroke = selected ? 0x7CFF6B : 0x9fefc0
    const btn = this.add.rectangle(x, y, w, h, fill, 0.92)
      .setStrokeStyle(2, stroke)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => btn.setFillStyle(0x244d38, 0.95))
      .on('pointerout', () => btn.setFillStyle(fill, 0.92))
      .on('pointerup', onClick)

    this.add.text(x, y, label, {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#e8ffe8',
    }).setOrigin(0.5)

    return btn
  }
}
