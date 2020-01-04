var BootScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
        function BootScene() {
            Phaser.Scene.call(this, {key: 'BootScene'});
        },
    preload: function () {
        // map tiles
        this.load.image('tiles', 'assets/map/spritesheet.png');

        // map in json format
        this.load.tilemapTiledJSON('map', 'assets/map/map.json');

        // our two characters
        this.load.spritesheet('player', 'assets/RPG_assets.png', {frameWidth: 16, frameHeight: 16});
    },
    create: function () {
        // start the WorldScene
        this.scene.start('WorldScene');
    }
});

var WorldScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
        function WorldScene() {
            Phaser.Scene.call(this, {key: 'WorldScene'});
        },
    preload: function () {
    },
    create: function () {
        // create the map
        var map = this.make.tilemap({key: 'map'});

        // first parameter is the name of the tilemap in tiled
        var tiles = map.addTilesetImage('spritesheet', 'tiles');

        // creating the layers
        var grass = map.createStaticLayer('Grass', tiles, 0, 0);
        var obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);

        // make all tiles in obstacles collidable
        obstacles.setCollisionByExclusion([-1]);

        //  Player 1 Animations
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


        // Player 2 Animations
        this.anims.create({
            key: 'left2',
            frames: this.anims.generateFrameNumbers('player', {frames: [4, 10, 4, 16]}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right2',
            frames: this.anims.generateFrameNumbers('player', {frames: [4, 10, 4, 16]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up2',
            frames: this.anims.generateFrameNumbers('player', {frames: [5, 11, 5, 17]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down2',
            frames: this.anims.generateFrameNumbers('player', {frames: [3, 9, 3, 15]}),
            frameRate: 10,
            repeat: -1
        });

        // our player sprite created through the phycis system
        this.player = this.physics.add.sprite(70, 100, 'player', 6);

        this.playerTwo = this.physics.add.sprite(50, 100, 'player', 3);

        // don't go out of the map
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);

        // don't walk on trees
        this.physics.add.collider(this.player, obstacles);

        // limit camera to map
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true; // avoid tile bleed

        // user input
        this.cursors = this.input.keyboard.createCursorKeys();

        // where the enemies will be
        this.spawns = this.physics.add.group({classType: Phaser.GameObjects.Zone});
        for (var i = 0; i < 30; i++) {
            var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
            var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
            // parameters are x, y, width, height
            this.spawns.create(x, y, 20, 20);
        }
        // add collider
        this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, false, this);
    },
    onMeetEnemy: function (player, zone) {
        // we move the zone to some other location
        zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

        // shake the world
        this.cameras.main.shake(300);

        // TODO: start battle?
    },
    update: function (time, delta) {
        //    this.controls.update(delta);

        // TODO: Improve follow physics...
        this.player.body.setVelocity(0);
        this.playerTwo.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown) {
            this.playerTwo.x = this.player.x + 20;
            this.playerTwo.y = this.player.y;

            this.player.body.setVelocityX(-80);
            this.playerTwo.body.setVelocityX(-80);
        } else if (this.cursors.right.isDown) {
            this.playerTwo.x = this.player.x - 20;
            this.playerTwo.y = this.player.y;

            this.player.body.setVelocityX(80);
            this.playerTwo.body.setVelocityX(80);
        }

        // Vertical movement
        if (this.cursors.up.isDown) {
            this.playerTwo.x = this.player.x;
            this.playerTwo.y = this.player.y + 20;

            this.player.body.setVelocityY(-80);
            this.playerTwo.body.setVelocityY(-80);
        } else if (this.cursors.down.isDown) {
            this.playerTwo.x = this.player.x;
            this.playerTwo.y = this.player.y - 20;

            this.player.body.setVelocityY(80);
            this.playerTwo.body.setVelocityY(80);
        }

        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.cursors.left.isDown) {
            this.player.anims.play('left', true);
            this.player.flipX = true;

            this.playerTwo.anims.play('left2', true);
            this.playerTwo.flipX = true;

        } else if (this.cursors.right.isDown) {
            this.player.anims.play('right', true);
            this.player.flipX = false;

            this.playerTwo.anims.play('right2', true);
            this.playerTwo.flipX = false;

        } else if (this.cursors.up.isDown) {
            this.player.anims.play('up', true);

            this.playerTwo.anims.play('up2', true);


        } else if (this.cursors.down.isDown) {
            this.player.anims.play('down', true);

            this.playerTwo.anims.play('down2', true);

        } else {
            this.player.anims.stop();
            this.playerTwo.anims.stop();
        }
    }

});

var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 320,
    height: 240,
    zoom: 2,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: true // set to true to view zones
        }
    },
    scene: [
        BootScene,
        WorldScene
    ]
};
var game = new Phaser.Game(config);
