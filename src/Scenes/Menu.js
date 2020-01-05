import 'phaser';

export default class MenuScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    preload() {
        // TODO: Move...
        this.levels = {
            1: 'level1',
            2: 'level2'
        };
    }

    create() {
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.20, 'logo').setDepth(1);
        this.add.image(0, 0, "lis").setOrigin(0).setDepth(0).setScale(2).setDisplaySize(this.game.config.width, this.game.config.height);

        let playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, "play").setDepth(1);
        playButton.setInteractive();

        playButton.on("pointerup", () => {
            this.scene.start('Game', {level: 1, newGame: true, levels: this.levels});
        })

    }
};
