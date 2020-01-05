import 'phaser';
import Player from '../Sprites/Player';
import Portal from '../Sprites/Portal';

export default class GameScene extends Phaser.Scene {
  constructor (key) {
    super(key);
  }

  init (data) {
    this._LEVEL = data.level;
    this._LEVELS = data.levels;
    this._NEWGAME = data.newGame;
    this.loadingLevel = false;
  }

  create () {
    // listen for the resize event
    this.scale.on('resize', this.resize, this);
    // listen for player input
    this.cursors = this.input.keyboard.createCursorKeys();

    // create our tilemap
    this.createMap();

    // Animations
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', {frames: [1, 7, 1, 13]}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', {frames: [1, 7, 1, 13]}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', {frames: [2, 8, 2, 14]}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', {frames: [0, 6, 0, 12]}),
      frameRate: 10,
      repeat: -1
    });


    // create our player
    this.createPlayer();
    // creating the portal
    this.createPortal();

    // add collisions
    this.addCollisions();

    // update our camera
    this.cameras.main.startFollow(this.player);
    this.cameras.main.zoom = 2;
  }

  update () {
    this.player.update(this.cursors);
  }

  addCollisions () {
    this.physics.add.collider(this.player, this.blockedLayer);

    // Bind player and portal
    this.physics.add.overlap(this.player, this.portal, this.loadNextLevel.bind(this));
  }

  createPlayer () {
    this.map.findObject('Player', (obj) => {
      if (this._NEWGAME && this._LEVEL === 1) {
        if (obj.type === 'StartingPosition') {
          this.player = new Player(this, obj.x, obj.y);
        }
      } else {
        if (obj.type === 'StartingPositionPortal'){
          this.player = new Player(this, obj.x, obj.y);
        }
      }
    });
  }

  createPortal () {
    this.map.findObject('Portal', (obj) => {
      if (this._LEVEL === 1) {
        this.portal = new Portal(this, obj.x, obj.y);
      } else if (this._LEVEL === 2) {
        this.portal = new Portal(this, obj.x, obj.y);
      }
    });
  }

  resize (gameSize, baseSize, displaySize, resolution) {
   let width = gameSize.width;
   let height = gameSize.height;
   if (width === undefined) {
     width = this.sys.game.config.width;
   }
   if (height === undefined) {
     height = this.sys.game.config.height;
   }
   this.cameras.resize(width, height);
 }

  createMap () {
    console.log("MAP!");
    this.map = this.make.tilemap({ key: this._LEVELS[this._LEVEL] });

    // add water background
    if (this._LEVEL === 1){
      // create the tilemap
      this.add.tileSprite(0, 0, 4000, 4000, 'overworld', 70);
      // add tileset image
      this.tiles = this.map.addTilesetImage('overworld');
    } else {
      this.tiles = this.map.addTilesetImage('rpg indoor tileset expansion 1 trans');
    }
    // create our layers
    this.backgroundLayer = this.map.createStaticLayer('Background', this.tiles, 0, 0);
    this.blockedLayer = this.map.createStaticLayer('Blocked', this.tiles, 0, 0);
    this.blockedLayer.setCollisionByExclusion([-1]);
  }

  loadNextLevel () {
    if (!this.loadingLevel) {
      this.cameras.main.fade(500, 0, 0, 0);
      this.cameras.main.on('camerafadeoutcomplete', () => {
        if (this._LEVEL === 1) {
          this.scene.restart({ level: 2, levels: this._LEVELS, newGame: false });
        } else if (this._LEVEL === 2) {
          this.scene.restart({ level: 1, levels: this._LEVELS, newGame: false });
        }
      });
      this.loadingLevel = true;
    }
  }
};
