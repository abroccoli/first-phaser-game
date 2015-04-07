'use strict';

var game = new Phaser.Game(1000, 600, Phaser.AUTO, 'final_project', { preload: preload, create: create, render: render, update: update });

function preload(){
  game.load.spritesheet('hero', 'images/YeOldyNecroGuy.png', 16, 15, 24, 18, 5.8);
  game.load.spritesheet('fire', 'images/rsz_fireballs_transparent.png', 30, 16, -1, 0, 0);
  game.load.image('platform', 'images/winter_ground/ground2.png');
}

var sprite1, cursors, platforms, ground, attackkey, fireballs;

function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE);

  platforms = game.add.group();
  fireballs = game.add.group();

  platforms.enableBody = true;
  fireballs.enableBody = true;

  ground = game.add.tileSprite( 0, game.world.height - 50, game.world.width, 0, 'platform');
  ground.physicsType = Phaser.SPRITE;
  platforms.add(ground);

  sprite1 = game.add.sprite(100, 530, 'hero');
  sprite1.scale.x = 2;
  sprite1.scale.y = 2;

  game.physics.arcade.enable([sprite1, platforms, ground, fireballs]);
  ground.body.immovable = true;
  ground.body.allowGravity = false;

  sprite1.body.gravity.y = 500;
  sprite1.body.collideWorldBounds = true;
  sprite1.animations.add('right', [6,8,9], 10, true);
  sprite1.animations.add('up', [7], 10, true);
  sprite1.animations.add('down', [9], 10, true);
  sprite1.animations.add('attack', [12], 10, true);
  sprite1.flipped = false;

  cursors = game.input.keyboard.createCursorKeys();
  attackkey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function render(){
}

function update(){
  game.physics.arcade.collide(sprite1, platforms);
  controls();
}

var Character = {
  movement: {
    runRight: function(){
      if (sprite1.flipped === true){
        sprite1.scale.x *= -1;
        sprite1.flipped = false;
      }
      sprite1.animations.play('right');
    },

    runLeft: function(){
      if (sprite1.flipped === false){
        sprite1.scale.x *= -1;
        sprite1.flipped = true;
      }
      sprite1.animations.play('right');
    },

    jump: function(){
      sprite1.animations.play('up');
    },

    fall: function(){
      sprite1.animations.play('down');
    },
    attack: function(){
      var fireball;
      if (sprite1.flipped === true){
        fireball = fireballs.create(sprite1.body.x + sprite1.body.width / 2 - 20, sprite1.body.y + sprite1.body.height / 2, 'fire');
        fireball.scale.x *= -1;
        fireball.body.velocity.x = -400;
      } else{
        fireball = fireballs.create(sprite1.body.x + sprite1.body.width / 2 + 10, sprite1.body.y + sprite1.body.height / 2, 'fire');
        fireball.body.velocity.x = 400;
      }
      fireball.outOfBoundsKill = true;
    }
  }
};

var controls = function(){
  sprite1.anchor.setTo(0.5,0.5);
  sprite1.body.velocity.x = 0;

  if (cursors.right.isDown){
    sprite1.body.velocity.x = 150;
    Character.movement.runRight();
  }else if(cursors.left.isDown){
    sprite1.body.velocity.x = -150;
    Character.movement.runLeft();
  }else{
    sprite1.animations.stop();
  }
  if(cursors.up.isDown && sprite1.body.velocity.y === 0){
    sprite1.body.velocity.y = -300;
  }
  if(sprite1.body.velocity.y < 0){
    Character.movement.jump();
  }else if(sprite1.body.velocity.y > 0){
    Character.movement.fall();
  }
  if(attackkey.isDown){
    Character.movement.attack();
  }
};
