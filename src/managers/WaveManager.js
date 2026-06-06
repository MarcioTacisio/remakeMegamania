import {
  ENEMY_BASE_SPEED, ENEMY_ZIGZAG_AMPLITUDE, ENEMY_ZIGZAG_FREQ,
  ENEMY_SHOOT_INTERVAL, ENEMIES_PER_ROW, WAVE_COUNTS
} from '../constants.js';

export default class WaveManager {
  constructor(scene) {
    this.scene = scene;
    this.currentLevel = 0;
    this.currentWave = 0;
    this.totalWaves = 0;
    this.waveActive = false;
    this.shootTimer = 0;
  }

  startLevel(level) {
    this.currentLevel = level;
    this.currentWave = 0;
    this.totalWaves = WAVE_COUNTS[level % WAVE_COUNTS.length] || 5;
    this.spawnWave();
  }

  spawnWave() {
    const scene = this.scene;
    const level = this.currentLevel;
    const group = scene.enemyGroup;
    const count = ENEMIES_PER_ROW + Math.min(level, 2);

    const speed = ENEMY_BASE_SPEED + level * 5;
    const amp = ENEMY_ZIGZAG_AMPLITUDE;
    const freq = ENEMY_ZIGZAG_FREQ + level * 0.0002;
    const spacing = 260 / (count + 1);
    const type = level % 5;

    for (let i = 0; i < count; i++) {
      const x = spacing * (i + 1) + 10;
      const enemy = scene.physics.add.sprite(x, -20, `spr_enemy_${type}`);
      enemy.body.setAllowGravity(false);
      enemy.body.setSize(14, 14);
      enemy.body.setOffset(1, 1);
      enemy.body.setVelocityY(speed);
      enemy.setData('spawnX', x);
      enemy.setData('speed', speed);
      enemy.setData('amp', amp);
      enemy.setData('freq', freq);
      enemy.setData('offset', Math.random() * Math.PI * 2);
      group.add(enemy);
    }

    this.waveActive = true;
    this.shootTimer = 0;
  }

  update(time, delta) {
    if (!this.waveActive) return;
    const group = this.scene.enemyGroup;

    const active = group.getChildren().filter(e => e.active);
    if (active.length === 0) {
      this.waveActive = false;
      this.currentWave++;
      this.scene.onWaveComplete();
      // Concede escudo ao player ao completar a wave
      if (this.scene.player && typeof this.scene.player.gainShield === 'function') {
        this.scene.player.gainShield();
      }
      if (this.currentWave >= this.totalWaves) {
        this.scene.onLevelComplete();
      } else {
        this.spawnWave();
      }
      return;
    }

    this.shootTimer += delta;
    if (this.shootTimer >= ENEMY_SHOOT_INTERVAL) {
      this.shootTimer = 0;
      const alive = active.filter(e => e.y > 0);
      if (alive.length > 0) {
        const s = alive[Math.floor(Math.random() * alive.length)];
        this.scene.enemyShoot(s.x, s.y + 8);
      }
    }
  }
}
