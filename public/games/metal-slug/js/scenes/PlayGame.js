import Bullet from "../entities/Bullet.js"
import Enemy from "../entities/Enemy.js"
import Player from "../entities/Player.js"

const WORLD_W = 3455
const WORLD_H = 448

export default class PlayGame extends Phaser.Scene {
  constructor() {
    super('playscene')
    this.player = null
    this.bullets = null
    this.enemyBullets = null
    this.enemies = null
    this.obstacles = null
  }

  init() {
    this.cursors = this.keys = this.input.keyboard.addKeys({
      a: Phaser.Input.Keyboard.KeyCodes.A,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
    })
  }

  create() {
    const version = this.registry.get('metalVersion') || 1

    const bg = this.add.image(0, 0, 'background1').setOrigin(0)
    // Keep background aligned to original world size (3455x454 art)
    bg.setDisplaySize(WORLD_W, 454)

    if (version === 3) {
      bg.setTint(0x88ffaa)
      this.cameras.main.setBackgroundColor('#001a10')
      this.cameras.main.setZoom(1)
    } else {
      this.cameras.main.setBackgroundColor('#000000')
    }

    const mapa2 = this.make.tilemap({ key: 'mapa2' })
    const objectsLayer = mapa2.getObjectLayer('objectlayer')

    this.enemies = this.physics.add.group({
      classType: Enemy,
      defaultKey: 'enemy',
      runChildUpdate: true,
      maxSize: -1,
    })

    this.obstacles = this.physics.add.staticGroup()

    objectsLayer.objects.forEach((object) => {
      const { x, y, name, width, height } = object

      switch (name) {
        case 'player_spawn':
          this.player = new Player(this, x, y, 'idle1')
          break
        case 'enemy_spawn':
          this.enemies.get(x, y, 'enemy_idle0')
          // Metal Slug 3: duplicate nearby spawns for denser combat
          if (version === 3) {
            this.enemies.get(x + 80, y, 'enemy_idle0')
          }
          break
        case 'obs':
          const rect = this.add.rectangle(x, y, width, height).setOrigin(0)
          this.obstacles.add(rect)
          break
      }
    })

    this.bullets = this.physics.add.group({
      classType: Bullet,
      defaultKey: 'bullet',
      runChildUpdate: true,
      maxSize: -1,
      allowGravity: false,
    })

    this.enemyBullets = this.physics.add.group({
      classType: Bullet,
      defaultKey: 'bullet',
      runChildUpdate: true,
      maxSize: -1,
      allowGravity: false,
    })

    this.physics.add.collider(this.obstacles, this.player)
    this.physics.add.collider(this.obstacles, this.enemies)
    this.physics.add.collider(this.enemies, this.player, () => {
      this.player.decreaseHp(1000)
    }, null, this)
    this.physics.add.overlap(this.enemies, this.bullets, (enemy, bullet) => {
      enemy.decreaseHp(bullet.gameObject.attack)
      bullet.destroy()
    }, null, this)

    this.physics.add.overlap(this.player, this.enemyBullets, (player, bullet) => {
      bullet.destroy()
      player.decreaseHp(bullet.gameObject.attack)
    }, null, this)

    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H)
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H, true)
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12)
    this.cameras.main.setRoundPixels(true)

    const label = version === 3 ? 'METAL SLUG 3' : 'METAL SLUG'
    this.add.text(12, 10, label, {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: version === 3 ? '#7CFF6B' : '#FFE566',
      stroke: '#000',
      strokeThickness: 3,
    }).setScrollFactor(0).setDepth(20)
  }

  update(time) {
    if (this.player) this.player.update(time)

    const version = this.registry.get('metalVersion') || 1
    const fireGap = version === 3 ? 750 : 1050

    this.enemies.getChildren().forEach((enemy) => {
      enemy.radar(this.player)
      if (enemy.isShooting && time > (enemy.lastShot + fireGap)) {
        const bullet = this.enemyBullets.get()
        if (bullet) {
          bullet.setAttachGameObject(enemy, enemy.x + 20, enemy.y - 7)
          bullet.shoot()
          enemy.lastShot = time
        }
      }
    })

    if ((this.player.stateMachine.isCurrentState('shooting') || this.player.stateMachine.isCurrentState('crouch_fire')) && time > (this.player.lastShot + 150)) {
      const bullet = this.bullets.get(0, 0)
      if (bullet) {
        if (this.player.stateMachine.isCurrentState('crouch_fire')) {
          bullet.setAttachGameObject(this.player, this.player.x + 20, this.player.y + 3)
        } else {
          bullet.setAttachGameObject(this.player, this.player.x + 20, this.player.y - 7)
        }
        bullet.shoot()
        this.player.lastShot = time
      }
    }
  }
}
