export default class InputHandler {
  constructor(scene) {
    this.scene = scene;
    this.left = false;
    this.right = false;
    this.fire = false;

    this.keys = scene.input.keyboard.createCursorKeys();
    this.keysA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keysD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.pointer = scene.input.activePointer;
    this.isDown = false;
    this.pointerX = 0;

    scene.input.on('pointerdown', (p) => {
      this.isDown = true;
      this.pointerX = p.x;
    });

    scene.input.on('pointermove', (p) => {
      if (this.isDown) {
        this.pointerX = p.x;
      }
    });

    scene.input.on('pointerup', () => {
      this.isDown = false;
    });
  }

  update() {
    const k = this.keys;
    this.left = k.left.isDown || this.keysA.isDown;
    this.right = k.right.isDown || this.keysD.isDown;
    this.fire = k.up.isDown || k.down.isDown || this.spaceKey.isDown;

    if (this.isDown) {
      const half = this.scene.scale.width / 2;
      const third = this.scene.scale.width / 3;
      this.left = this.pointerX < third;
      this.right = this.pointerX > third * 2;
      if (!this.left && !this.right) {
        this.left = this.pointerX < half;
        this.right = this.pointerX > half;
      }
      this.fire = true;
    }
  }
}
