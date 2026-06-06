export const GAME_WIDTH = 320;
export const GAME_HEIGHT = 240;

export const PLAYER_SPEED = 220;
export const BULLET_SPEED = 450;
export const ENEMY_BULLET_SPEED = 130;
export const PLAYER_FIRE_RATE = 200;

export const ENERGY_DRAIN_RATE = 2.5;
export const MAX_LIVES = 3;

export const ENEMY_BASE_SPEED = 25;
export const ENEMY_ZIGZAG_AMPLITUDE = 35;
export const ENEMY_ZIGZAG_FREQ = 0.004;
export const ENEMY_SHOOT_INTERVAL = 3500;
export const POINTS_PER_KILL = 100;

export const ENEMIES_PER_ROW = 6;
export const ROWS_PER_WAVE = 1;
export const WAVE_COUNTS = [3, 3, 4, 4, 5];

export const ENEMY_TYPES = [
  { name: 'HAMBURGUER', body: 0xE8A317, patty: 0x8B4513, lettuce: 0x228B22, accent: 0xFFDD44 },
  { name: 'BOLACHA',    body: 0xDEB887, chip: 0x5C3317, accent: 0xF5DEB3 },
  { name: 'FERRO',      body: 0xA9A9A9, handle: 0x6B3A2A, hot: 0xFF2200, accent: 0xC0C0C0 },
  { name: 'GRAVATA',    fabric: 0xDC143C, knot: 0x8B0000, accent: 0xFFD700 },
  { name: 'DIAMANTE',   gem: 0x87CEEB, edge: 0x4169E1, highlight: 0xFFFFFF },
];
