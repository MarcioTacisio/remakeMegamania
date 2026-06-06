import {
  GAME_WIDTH, GAME_HEIGHT, POINTS_PER_KILL, ENEMY_TYPES, WAVE_COUNTS,
  ENEMY_BULLET_SPEED
} from '../constants.js';
import Player from '../entities/Player.js';
import InputHandler from '../input/InputHandler.js';
import EnergyBar from '../managers/EnergyBar.js';
import WaveManager from '../managers/WaveManager.js';
import ParticleManager from '../managers/ParticleManager.js';
import AudioManager from '../managers/AudioManager.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.score = 0;
    this.currentLevel = 0;
    this.gameOverFlag = false;

    this.audio = new AudioManager();
    this.audio.init();

    this.player = new Player(this, GAME_WIDTH / 2, GAME_HEIGHT - 20);

    this.playerBullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      defaultKey: 'spr_bullet',
      maxSize: 30,
    });

    this.enemyBullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Sprite,
      defaultKey: 'spr_enemy_bullet',
      maxSize: 30,
    });

    this.enemyGroup = this.add.group();

    this.energyBar = new EnergyBar(this);
    this.waveManager = new WaveManager(this);
    this.inputHandler = new InputHandler(this);
    this.particles = new ParticleManager(this);
    this.laserSound = this.sound.add('snd_laser', { volume: 0.6 });

    this.createHUD();
    this.setupCollisions();

    this.debugText = this.add.text(GAME_WIDTH / 2, 120, '', {
      fontFamily: 'monospace', fontSize: '7px', color: '#FF0000'
    }).setOrigin(0.5);

    this.audio.resume();

      this.audio.startMusic();
      this.waveManager.startLevel(this.currentLevel);
  }

  createHUD() {
    this.scoreText = this.add.text(4, 3, 'SCORE: 0', {
      fontFamily: 'Courier New, monospace',
      fontSize: '8px',
      color: '#FFFFFF',
    });

    this.levelText = this.add.text(GAME_WIDTH - 4, 3, 'LVL: 1', {
      fontFamily: 'Courier New, monospace',
      fontSize: '8px',
      color: '#FFFFFF',
    }).setOrigin(1, 0);

    this.waveText = this.add.text(GAME_WIDTH - 4, 13, 'ONDA: 1/3', {
      fontFamily: 'Courier New, monospace',
      fontSize: '7px',
      color: '#AAAAAA',
    }).setOrigin(1, 0);

    this.livesText = this.add.text(4, GAME_HEIGHT - 12, '♥♥♥', {
      fontFamily: 'Courier New, monospace',
      fontSize: '8px',
      color: '#FF4444',
    });

    this.messageText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10, '', {
      fontFamily: 'Courier New, monospace',
      fontSize: '10px',
      color: '#FFFF00',
      align: 'center',
    }).setOrigin(0.5).setAlpha(0);
  }

  setupCollisions() {
    this.physics.add.overlap(
      this.playerBullets, this.enemyGroup,
      this.onBulletHitEnemy, null, this
    );

    this.physics.add.overlap(
      this.enemyBullets, this.player,
      this.onBulletHitPlayer, null, this
    );

    this.physics.add.overlap(
      this.player, this.enemyGroup,
      this.onPlayerHitEnemy, null, this
    );
  }

  onBulletHitEnemy(bullet, enemy) {
    if (!bullet.active || !enemy.active) return;
    bullet.setActive(false).setVisible(false);
    bullet.body.enable = false;

    enemy.setActive(false);
    enemy.setVisible(false);
    enemy.body.enable = false;
    this.score += POINTS_PER_KILL;
    this.particles.burst(enemy.x, enemy.y, 5);
    this.audio.playExplosion();
    this.cameras.main.shake(50, 0.003);
  }

  onBulletHitPlayer(bullet, player) {
    if (!bullet.active || !player.active) return;
    bullet.setActive(false).setVisible(false);
    bullet.body.enable = false;
    this.playerHit();
  }

  onPlayerHitEnemy(player, enemy) {
    if (!player.active || !enemy.active) return;
    enemy.setActive(false);
    enemy.setVisible(false);
    enemy.body.enable = false;
    this.playerHit();
  }

  playerHit() {
    const lostLife = this.player.hit();
    if (lostLife) {
      this.particles.burst(this.player.x, this.player.y, 10);
      this.audio.playDeath();
      this.cameras.main.shake(200, 0.008);
    }
    if (this.player.lives <= 0 && !this.gameOverFlag) {
      this.onGameOver();
    }
  }

  enemyShoot(x, y) {
    const b = this.enemyBullets.get(x, y, 'spr_enemy_bullet');
    if (!b) return;
    b.setActive(true).setVisible(true);
    b.body.enable = true;
    b.body.reset(x, y);
      b.setVelocityY(ENEMY_BULLET_SPEED);
    b.body.setSize(4, 4);
  }

  onWaveComplete() {
    this.energyBar.refill();
    this.showMessage('ONDA COMPLETA!');
    this.time.delayedCall(800, () => this.hideMessage());
  }

  onLevelComplete() {
    this.currentLevel++;
    this.energyBar.refill();
    this.audio.playLevelUp();
    this.audio.stopMusic();

    const typeName = ENEMY_TYPES[this.currentLevel % ENEMY_TYPES.length].name;
    this.showMessage(`NÍVEL ${this.currentLevel + 1}\n${typeName}!`);
    this.time.delayedCall(2000, () => {
      this.hideMessage();
      this.waveManager.startLevel(this.currentLevel);
    });
  }

  onGameOver() {
    if (this.gameOverFlag) return;
    this.gameOverFlag = true;
    this.audio.stopMusic();
    this.player.kill();

    this.showMessage('GAME OVER', '#FF4444');
    this.time.delayedCall(2000, () => {
      this.scene.start('GameOverScene', {
        score: this.score,
        level: this.currentLevel + 1,
      });
    });
  }

  showMessage(text, color = '#FFFF00') {
    this.messageText.setText(text);
    this.messageText.setColor(color);
    this.messageText.setAlpha(1);
  }

  hideMessage() {
    this.messageText.setAlpha(0);
  }

  update(time, delta) {
    if (this.gameOverFlag) return;

    this.cleanBullets(this.playerBullets);
    this.cleanBullets(this.enemyBullets);

    this.inputHandler.update();
    this.player.update(delta, this.inputHandler, this.playerBullets, this.audio, this.laserSound);

    this.enemyGroup.getChildren().forEach(e => {
      if (!e.active) return;
      const targetX = e.getData('spawnX') + Math.sin(time * e.getData('freq') + e.getData('offset')) * e.getData('amp');
      e.setVelocityX((targetX - e.x) * 8);
      if (e.y > 260) { e.setActive(false).setVisible(false); e.body.enable = false; }
    });

    this.waveManager.update(time, delta);

    const depleted = this.energyBar.update(delta);
    if (depleted) {
      this.energyBar.refill();
      this.playerHit();
    }

    this.updateHUD();

    const ec = this.enemyGroup.getChildren().filter(e => e.active).length;
    this.debugText.setText(`E:${ec} LV:${this.currentLevel} W:${this.waveManager.currentWave}/${this.waveManager.totalWaves}`);
  }

  cleanBullets(group) {
    group.getChildren().forEach(b => {
      if (b.active && (b.y < -10 || b.y > GAME_HEIGHT + 10)) {
        b.setActive(false).setVisible(false);
        b.body.enable = false;
      }
    });
  }

  updateHUD() {
    this.scoreText.setText(`SCORE: ${String(this.score).padStart(6, '0')}`);
    this.levelText.setText(`LVL: ${this.currentLevel + 1}`);

    const totalWaves = WAVE_COUNTS[this.currentLevel % WAVE_COUNTS.length] || 5;
    const wave = this.waveManager.currentWave + 1;
    this.waveText.setText(`ONDA: ${Math.min(wave, totalWaves)}/${totalWaves}`);

    let hearts = '';
    for (let i = 0; i < this.player.lives; i++) hearts += '♥';
    this.livesText.setText(hearts || '☠');
  }
}
