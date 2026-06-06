import { ENEMY_TYPES } from '../constants.js';

export default class SpriteGenerator {
  static generateAll(scene) {
    this.generatePlayer(scene);
    this.generateBullet(scene);
    this.generateEnemyBullet(scene);
    this.generateParticle(scene);
    Object.keys(ENEMY_TYPES).forEach((key, i) => {
      this.generateEnemy(scene, parseInt(key), ENEMY_TYPES[key]);
    });
  }

  static pix(g, x, y, color) {
    g.fillStyle(color);
    g.fillRect(x, y, 1, 1);
  }

  static generatePlayer(scene) {
    const g = scene.add.graphics();
    const c = 0x00DDFF;
    const w = 0xFFFFFF;
    const d = 0x0066AA;

    for (let y = 0; y < 9; y++) {
      for (let x = 0; x <= y; x++) {
        const px = 7 - x;
        const py = y;
        this.pix(g, px, py, c);
        this.pix(g, 7 + x, py, c);
      }
    }

    this.pix(g, 6, 1, w);
    this.pix(g, 8, 1, w);
    this.pix(g, 6, 2, w);
    this.pix(g, 8, 2, w);

    this.pix(g, 7, 3, w);
    this.pix(g, 7, 4, w);

    for (let y = 9; y < 15; y++) {
      for (let x = 0; x < 15; x++) {
        const dx = Math.abs(x - 7);
        if (dx <= 2) {
          this.pix(g, x, y, c);
        }
      }
    }

    this.pix(g, 5, 10, d);
    this.pix(g, 9, 10, d);
    this.pix(g, 4, 11, d);
    this.pix(g, 10, 11, d);
    this.pix(g, 3, 12, d);
    this.pix(g, 11, 12, d);
    this.pix(g, 5, 13, d);
    this.pix(g, 9, 13, d);
    this.pix(g, 6, 14, d);
    this.pix(g, 8, 14, d);

    g.generateTexture('spr_player', 15, 15);
    g.destroy();
  }

  static generateBullet(scene) {
    const g = scene.add.graphics();
    g.fillStyle(0x00FFAA);
    g.fillRect(1, 0, 2, 6);
    g.fillStyle(0xFFFFFF);
    g.fillRect(2, 0, 1, 1);
    g.fillRect(1, 5, 2, 1);
    g.generateTexture('spr_bullet', 4, 6);
    g.destroy();
  }

  static generateEnemyBullet(scene) {
    const g = scene.add.graphics();
    g.fillStyle(0xFF4400);
    g.fillRect(1, 0, 3, 3);
    g.fillStyle(0xFFFF00);
    g.fillRect(1, 0, 2, 2);
    g.fillRect(2, 1, 1, 1);
    g.generateTexture('spr_enemy_bullet', 4, 4);
    g.destroy();
  }

  static generateParticle(scene) {
    const g = scene.add.graphics();
    g.fillStyle(0xFFFFFF);
    g.fillRect(0, 0, 2, 2);
    g.generateTexture('spr_particle', 2, 2);
    g.destroy();
  }

  static generateEnemy(scene, index, colors) {
    const g = scene.add.graphics();
    const SIZE = 16;

    switch (index) {
      case 0: this.drawHamburger(g, colors); break;
      case 1: this.drawCookie(g, colors); break;
      case 2: this.drawIron(g, colors); break;
      case 3: this.drawBowtie(g, colors); break;
      case 4: this.drawDiamond(g, colors); break;
    }

    g.generateTexture(`spr_enemy_${index}`, SIZE, SIZE);
    g.destroy();
  }

  static drawHamburger(g, c) {
    const bun = c.body;
    const patty = c.patty;
    const lettuce = c.lettuce;
    const seed = c.accent;

    g.fillStyle(bun);
    g.fillRect(1, 0, 14, 5);
    g.fillRect(0, 5, 16, 1);

    g.fillStyle(seed);
    g.fillRect(3, 1, 2, 1);
    g.fillRect(8, 2, 2, 1);
    g.fillRect(5, 1, 2, 1);
    g.fillRect(11, 1, 2, 1);

    g.fillStyle(lettuce);
    g.fillRect(0, 6, 16, 2);

    g.fillStyle(patty);
    g.fillRect(1, 8, 14, 3);

    g.fillStyle(bun);
    g.fillRect(0, 11, 16, 1);
    g.fillRect(1, 12, 14, 4);
  }

  static drawCookie(g, c) {
    const dough = c.body;
    const chip = c.chip;
    const highlight = c.accent;

    g.fillStyle(dough);
    g.fillCircle(8, 8, 7);

    g.fillStyle(chip);
    g.fillRect(3, 4, 2, 2);
    g.fillRect(9, 3, 2, 2);
    g.fillRect(5, 8, 2, 2);
    g.fillRect(11, 7, 2, 2);
    g.fillRect(7, 11, 2, 2);

    g.fillStyle(highlight);
    g.fillRect(13, 4, 1, 1);
    g.fillRect(5, 2, 1, 1);
    g.fillRect(10, 10, 1, 1);
  }

  static drawIron(g, c) {
    const metal = c.body;
    const handle = c.handle;
    const hot = c.hot;
    const accent = c.accent;

    g.fillStyle(handle);
    g.fillRect(0, 2, 5, 3);
    g.fillRect(5, 1, 2, 5);

    g.fillStyle(metal);
    g.fillRect(5, 5, 11, 2);
    g.fillRect(6, 3, 10, 9);
    g.fillRect(7, 2, 8, 11);

    g.fillStyle(hot);
    g.fillRect(7, 10, 8, 3);

    g.fillStyle(accent);
    g.fillRect(7, 7, 3, 2);
    g.fillRect(12, 4, 2, 2);
  }

  static drawBowtie(g, c) {
    const fabric = c.fabric;
    const knot = c.knot;
    const accent = c.accent;

    g.fillStyle(knot);
    g.fillRect(6, 5, 4, 6);

    g.fillStyle(fabric);
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x <= y; x++) {
        this.pix(g, 5 - x, 5 + y, fabric);
        this.pix(g, 10 + x, 5 + y, fabric);
      }
    }

    for (let y = 0; y < 5; y++) {
      for (let x = 0; x <= y; x++) {
        this.pix(g, 5 - x, 10 - y, fabric);
        this.pix(g, 10 + x, 10 - y, fabric);
      }
    }

    g.fillStyle(accent);
    this.pix(g, 6, 4, accent);
    this.pix(g, 9, 4, accent);
    this.pix(g, 5, 8, accent);
    this.pix(g, 10, 8, accent);
    this.pix(g, 6, 10, accent);
    this.pix(g, 9, 10, accent);
    this.pix(g, 7, 7, accent);
    this.pix(g, 8, 7, accent);
  }

  static drawDiamond(g, c) {
    const gem = c.gem;
    const edge = c.edge;
    const highlight = c.highlight;

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x <= y; x++) {
        this.pix(g, 7 - x, y, gem);
        this.pix(g, 8 + x, y, gem);
      }
    }

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x <= y; x++) {
        this.pix(g, 7 - x, 15 - y, gem);
        this.pix(g, 8 + x, 15 - y, gem);
      }
    }

    g.fillStyle(edge);
    for (let y = 0; y < 16; y++) {
      const r = Math.min(y, 15 - y);
      this.pix(g, 7 - r, y, edge);
      this.pix(g, 8 + r, y, edge);
    }

    g.fillStyle(highlight);
    this.pix(g, 7, 2, highlight);
    this.pix(g, 8, 2, highlight);
    this.pix(g, 7, 3, highlight);
    this.pix(g, 8, 3, highlight);
    this.pix(g, 7, 4, highlight);
    this.pix(g, 8, 4, highlight);
    this.pix(g, 7, 5, highlight);
    this.pix(g, 8, 5, highlight);
  }
}
