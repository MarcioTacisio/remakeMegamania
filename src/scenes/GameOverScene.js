import { GAME_WIDTH, GAME_HEIGHT } from '../constants.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.level = data.level || 1;
  }

  create() {
    this.add.text(GAME_WIDTH / 2, 60, 'GAME OVER', {
      fontFamily: 'Courier New, monospace',
      fontSize: '16px',
      color: '#FF4444'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 100, `SCORE: ${this.finalScore}`, {
      fontFamily: 'Courier New, monospace',
      fontSize: '10px',
      color: '#FFFFFF'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 120, `NÍVEL: ${this.level}`, {
      fontFamily: 'Courier New, monospace',
      fontSize: '8px',
      color: '#AAAAAA'
    }).setOrigin(0.5);

    const cont = this.add.text(GAME_WIDTH / 2, 180, 'PRESSIONE ESPAÇO\nOU TOQUE PARA REINICIAR', {
      fontFamily: 'Courier New, monospace',
      fontSize: '8px',
      color: '#FFFF00',
      align: 'center'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: cont,
      alpha: 0.3,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    this.input.keyboard.once('keydown-SPACE', () => this.restart());
    this.input.once('pointerdown', () => this.restart());
  }

  restart() {
    this.scene.start('GameScene');
  }
}
