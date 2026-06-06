export default class ParticleManager {
  constructor(scene) {
    this.scene = scene;
    this.emitter = scene.add.particles(0, 0, 'spr_particle', {
      speed: { min: 40, max: 180 },
      scale: { start: 1.5, end: 0 },
      lifespan: { min: 150, max: 350 },
      emitting: false,
    });
  }

  burst(x, y, count = 6) {
    this.emitter.emitParticleAt(x, y, count);
  }

  destroy() {
    this.emitter.destroy();
  }
}
