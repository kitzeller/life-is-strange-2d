import 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor (scene, x, y) {
    super(scene, x, y, 'player', 0);
    this.scene = scene;

    // enable physics
    this.scene.physics.world.enable(this);
    // add our player to the scene
    this.scene.add.existing(this);
    // scale our player
    // this.setScale(4);
  }

  update (cursors) {
    this.setVelocity(0);
    // check if the up or down key is pressed
    if (cursors.up.isDown) {
      this.setVelocityY(-150);
    } else if (cursors.down.isDown) {
      this.setVelocityY(150);
    }
    // check if the left or right key is pressed
    if (cursors.left.isDown) {
      this.setVelocityX(-150);
    } else if (cursors.right.isDown) {
      this.setVelocityX(150);
    }


    // Animations
    if (cursors.left.isDown) {
      this.anims.play('left', true);
      this.flipX = true;

    } else if (cursors.right.isDown) {
      this.anims.play('right', true);
      this.flipX = false;

    } else if (cursors.up.isDown) {
      this.anims.play('up', true);

    } else if (cursors.down.isDown) {
      this.anims.play('down', true);

    } else {
      this.anims.stop();

    }
  }
}
