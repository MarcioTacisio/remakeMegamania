import SpriteGenerator from '../managers/SpriteGenerator.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.audio('snd_laser', 'assets/tei.mp3');
  }

  create() {
    SpriteGenerator.generateAll(this);

    this.add.text(160, 110, 'CARREGANDO...', {
      fontFamily: 'Courier New, monospace',
      fontSize: '8px',
      color: '#FFFFFF'
    }).setOrigin(0.5);

    this.time.delayedCall(300, () => {
      this.scene.start('GameScene');
    });
  }
}
