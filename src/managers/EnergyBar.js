import { GAME_WIDTH, GAME_HEIGHT, ENERGY_DRAIN_RATE } from '../constants.js';

export default class EnergyBar {
  constructor(scene) {
    this.scene = scene;
    this.energy = 100;
    this.maxEnergy = 100;
    this.graphics = scene.add.graphics();
    this.warningFlag = false;
    this.draw();
  }

  update(delta) {
    const wasAboveZero = this.energy > 0;
    this.energy -= ENERGY_DRAIN_RATE * (delta / 1000);
    if (this.energy < 0) this.energy = 0;

    this.draw();

    if (this.energy <= 25 && this.energy > 0 && !this.warningFlag) {
      this.warningFlag = true;
      this.scene.audio.playEnergyWarning();
    }
    if (this.energy > 25) {
      this.warningFlag = false;
    }

    return this.energy <= 0 && wasAboveZero;
  }

  refill() {
    this.energy = this.maxEnergy;
    this.warningFlag = false;
    this.draw();
  }

  draw() {
    const g = this.graphics;
    g.clear();

    const barW = 160;
    const barH = 8;
    const x = (GAME_WIDTH - barW) / 2;
    const y = GAME_HEIGHT - 14;

    g.fillStyle(0x222222);
    g.fillRect(x - 1, y - 1, barW + 2, barH + 2);

    g.fillStyle(0x444444);
    g.fillRect(x, y, barW, barH);

    const pct = this.energy / this.maxEnergy;
    const fillW = barW * pct;

    let color;
    if (pct > 0.5) color = 0x00FF44;
    else if (pct > 0.25) color = 0xFFFF00;
    else color = 0xFF2200;

    g.fillStyle(color);
    g.fillRect(x, y, fillW, barH);

    g.lineStyle(1, 0x888888);
    g.strokeRect(x, y, barW, barH);
  }

  destroy() {
    this.graphics.destroy();
  }
}
