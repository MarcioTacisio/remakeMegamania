import { GAME_WIDTH, GAME_HEIGHT } from '../constants.js';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    this.stars = [];
    for (let i = 0; i < 60; i++) {
      this.stars.push({
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * GAME_HEIGHT,
        size: Math.random() < 0.2 ? 2 : 1,
        speed: 8 + Math.random() * 24,
        alpha: 0.3 + Math.random() * 0.7,
      });
    }
    this.starGraphics = this.add.graphics();

    this.add.text(GAME_WIDTH / 2, 60, 'MEGAMANIA', {
      fontFamily: 'Courier New, monospace',
      fontSize: '24px',
      color: '#00DDFF',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 90, 'R E M A K E', {
      fontFamily: 'Courier New, monospace',
      fontSize: '10px',
      color: '#FFFFFF',
    }).setOrigin(0.5);

    const prompt = this.add.text(GAME_WIDTH / 2, 170, 'PRESSIONE ESPAÇO\nPARA JOGAR', {
      fontFamily: 'Courier New, monospace',
      fontSize: '8px',
      color: '#FFFF00',
      align: 'center',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: prompt,
      alpha: 0.2,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    this.input.keyboard.once('keydown-SPACE', () => this.startGame());
    this.input.once('pointerdown', () => this.startGame());
  }

  startGame() {
    this.scene.start('GameScene');
  }

  update(time, delta) {
    const g = this.starGraphics;
    g.clear();

    for (const s of this.stars) {
      s.y += s.speed * (delta / 1000);
      if (s.y > GAME_HEIGHT) {
        s.y = 0;
        s.x = Math.random() * GAME_WIDTH;
      }
      g.fillStyle(0xFFFFFF, s.alpha);
      g.fillRect(Math.round(s.x), Math.round(s.y), s.size, s.size);
    }
  }
}
