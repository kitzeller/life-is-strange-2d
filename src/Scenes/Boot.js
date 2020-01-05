import 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor (key) {
    super(key);
  }

  preload () {
    this.levels = {
      1: 'level1',
      2: 'level2'
    };
    // load in the tilemap
    this.load.tilemapTiledJSON('level1', 'assets/tilemaps/mappy.json');

    // this.load.tilemapTiledJSON('level1', 'assets/tilemaps/level1.json');

    this.load.tilemapTiledJSON('level2', 'assets/tilemaps/mappy3.json');

    // load in the spritesheet
    this.load.spritesheet('RPGpack_sheet', 'assets/images/RPGpack_sheet.png', { frameWidth: 64, frameHeight: 64 });
    // load in our character spritesheet
    this.load.spritesheet('characters', 'assets/images/roguelikeChar_transparent.png', { frameWidth: 17, frameHeight: 17 });

    this.load.spritesheet('player', 'assets/images/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('overworld', 'assets/images/overworld.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('rpg indoor tileset expansion 1 trans', 'assets/images/rpg indoor tileset expansion 1 trans.png', { frameWidth: 16, frameHeight: 16 });

    // load our portal sprite
    this.load.image('portal', 'assets/images/portal.png');
    this.load.image('coin', 'assets/images/coin_01.png');
    this.load.image('lis', 'assets/images/lis-pix.jpg');
    this.load.image('logo', 'assets/images/lis-logo.png');
    this.load.image('play', 'assets/images/play_button.png');

  }

  create () {
    this.scene.start('Menu');
    // this.scene.start('Game', { level: 1, newGame: true, levels: this.levels });
  }
};
