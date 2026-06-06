import { GAME_WIDTH, GAME_HEIGHT, PLAYER_SPEED, BULLET_SPEED, PLAYER_FIRE_RATE } from '../constants.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'spr_player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.body.setSize(10, 12);
    this.body.setOffset(3, 2);

    this.lives = 3;
    this.isInvincible = false;
    this.isDead = false;
    this.fireTimer = 0;
    this.shieldActive = false; // escudo ativo
  }

  update(delta, input, bulletGroup, audio, laserSound) {
    if (this.isDead) return;

    if (input.left) {
      this.setVelocityX(-PLAYER_SPEED);
    } else if (input.right) {
      this.setVelocityX(PLAYER_SPEED);
    } else {
      this.setVelocityX(0);
    }

    this.fireTimer -= delta;
    if (input.fire && this.fireTimer <= 0) {
      this.fireTimer = PLAYER_FIRE_RATE;
      this.shoot(bulletGroup, audio, laserSound);
    }
  }

  shoot(bulletGroup, audio, laserSound) {
    const b = bulletGroup.get(this.x, this.y - 10, 'spr_bullet');
    if (!b) return;
    b.setActive(true).setVisible(true);
    b.body.enable = true;
    b.body.reset(this.x, this.y - 10);
    b.setVelocityY(-BULLET_SPEED);
    b.body.setSize(4, 6);
    if (laserSound) {
      laserSound.play();
    } else if (audio) {
      audio.playLaser();
    }
  }

  hit() {
    if (this.isInvincible || this.isDead) return false;
    this.lives--;
    this.isInvincible = true;
    this.isDead = true;

    this.setVisible(false);
    this.body.enable = false;

    let respawnDelay = 1500;
    if (this.lives <= 0) {
      respawnDelay = 500;
    }

    this.scene.time.delayedCall(respawnDelay, () => {
      if (this.lives <= 0) {
        this.scene.onGameOver();
        return;
      }
      this.isDead = false;
      this.setPosition(GAME_WIDTH / 2, GAME_HEIGHT - 20);
      this.setVisible(true);
      this.body.enable = true;
      this.alpha = 0.4;

      this.scene.tweens.add({
        targets: this,
        alpha: 1,
        duration: 100,
        yoyo: true,
        repeat: 6,
        onComplete: () => {
          this.isInvincible = false;
          this.alpha = 1;
        }
      });
    });

    return true;
  }

  kill() {
    this.isDead = true;
    this.setActive(false).setVisible(false);
    if (this.body) this.body.enable = false;
  }
}
