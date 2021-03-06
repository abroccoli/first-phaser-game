'use strict';

var game = new Phaser.Game(1000, 600, Phaser.AUTO, 'final_project', { preload: preload, create: create, render: render, update: update });

function preload(){
  game.load.spritesheet('hero', 'images/YeOldyNecroGuy.png', 16, 15, 24, 18, 5.8);
  game.load.spritesheet('hero2', 'images/YeOldyNecroGuy2.png', 16, 15, 24, 18, 5.8);
  game.load.spritesheet('fire', 'images/rsz_fireballs_transparent.png', 30, 16, -1, 0, 0);
  game.load.spritesheet('fire2', 'images/rsz_fireballs_transparent2.png', 30, 16, -1, 0, 0);
  game.load.image('platform', 'images/winter_ground/ground2.png');
  game.load.image('floatplatform', 'images/winter_ground/ground0.png');
  game.load.image('wallLeft', 'images/winter_ground/ground4.png');
}

var sprite1, sprite2, platforms, ground, fireballs, midwallLeft, midwallRight, leftFloat, leftCenterFloat, leftUpperFloat, midwallTop, rightFloat, rightCenterFloat, rightUpperFloat;

function create(){
  game.physics.startSystem(Phaser.Physics.ARCADE);

  fireballs = game.add.group();
  game.physics.arcade.enable(fireballs);

  World.initialize();

  Character.build();
}

function render(){
}

function update(){
  game.world.wrap(sprite1, 0, true, true, false);
  game.world.wrap(sprite2, 0, true, true, false);

  game.physics.arcade.collide(sprite1, platforms);
  game.physics.arcade.collide(sprite2, platforms);
  game.physics.arcade.collide(sprite1, sprite2);
  game.physics.arcade.collide(platforms, fireballs);

  controls();
  Fireballs.listen();
}

var Character = {
  build: function(){
    sprite1 = game.add.sprite(100, 530, 'hero');
    sprite1.scale.x = 2;
    sprite1.scale.y = 2;
    game.physics.arcade.enable(sprite1);
    sprite1.body.gravity.y = 500;
    sprite1.animations.add('right', [6,8,9], 10, true);
    sprite1.animations.add('up', [7], 10, true);
    sprite1.animations.add('down', [9], 10, true);
    sprite1.animations.add('attack', [12], 10, true);
    sprite1.animations.add('death', [4], 10, true);
    sprite1.flipped = false;

    sprite2 = game.add.sprite(900, 530, 'hero2');
    sprite2.scale.x = 2;
    sprite2.scale.y = 2;
    game.physics.arcade.enable(sprite2);
    sprite2.body.gravity.y = 500;
    sprite2.animations.add('right', [6,8,9], 10, true);
    sprite2.animations.add('up', [7], 10, true);
    sprite2.animations.add('down', [9], 10, true);
    sprite2.animations.add('attack', [12], 10, true);
    sprite2.animations.add('death', [4], 10, true);
    sprite2.flipped = false;
  },

  kill: function(sprite){
    console.log('hit');
    // sprite.animations.play('death');
    // sprite.kill();
  },

  movement: {
    runRight: function(sprite){
      if (sprite.flipped === true){
        sprite.scale.x *= -1;
        sprite.flipped = false;
      }
      sprite.animations.play('right');
    },

    runLeft: function(sprite){
      if (sprite.flipped === false){
        sprite.scale.x *= -1;
        sprite.flipped = true;
      }
      sprite.animations.play('right');
    },

    jump: function(sprite){
      sprite.animations.play('up');
    },

    fall: function(sprite){
      sprite.animations.play('down');
    },
    attack: function(sprite){
      Fireballs.create(sprite);
    }
  }
};

var Fireballs = {
  create: function(sprite){
    var fireball, color;

    if (sprite === sprite1){
      color = 'fire';
    }else if(sprite === sprite2){
      color = 'fire2';
    }
    if (sprite.flipped === true){
      fireball = fireballs.create(sprite.body.x + sprite.body.width / 2 - 20, sprite.body.y + sprite.body.height / 2-5, color);
      fireball.scale.x *= -1;
      fireball.body.velocity.x = -400;
    } else{
      fireball = fireballs.create(sprite.body.x + sprite.body.width / 2 + 10, sprite.body.y + sprite.body.height / 2-5, color);
      fireball.body.velocity.x = 400;
    }
  },
  listen:function(){
    for(var i=0; i<=fireballs.length-1; i++){
      fireballs.children[i].checkWorldBounds = true;
      if (fireballs.children[i].inWorld === false){
        fireballs.children[i].destroy();
      }else{
        if (fireballs.children[i].body.velocity.x === 0){
          fireballs.children[i].destroy();
        }
        game.physics.arcade.collide(fireballs.children[i], sprite1, Character.kill,null, this);
        game.physics.arcade.collide(fireballs.children[i], sprite2, Character.kill,null, this);
      }
    }
  }
};

var World = {
  initialize: function(){
    platforms = game.add.group();

    platforms.enableBody = true;
    fireballs.enableBody = true;

    this.build();

    for(var i=0; i<=platforms.length - 1; i++){
      platforms.children[i].body.immovable = true;
      platforms.children[i].body.allowGravity = false;
    }

    game.physics.arcade.enable([platforms, ground]);
  },
  build: function(){
    ground = game.add.tileSprite( -20, game.world.height - 50, game.world.width + 20, 0, 'platform');
    platforms.add(ground);

    midwallLeft = game.add.tileSprite(game.world.width/2 - 50, game.world.height-300, 50, game.world.height/2, 'wallLeft');
    platforms.add(midwallLeft);

    midwallRight = game.add.tileSprite(game.world.width/2 + 25, game.world.height-300, 50, game.world.height/2, 'wallLeft');
    platforms.add(midwallRight);
    midwallRight.anchor.setTo(0.5,0);
    midwallRight.scale.x *= -1;

    midwallTop = game.add.tileSprite(game.world.width/2 - 50 ,game.world.height/2,98,20,'floatplatform');
    platforms.add(midwallTop);

    leftFloat = game.add.tileSprite(-15,game.world.height/1.5,128,20,'floatplatform');
    platforms.add(leftFloat);

    leftCenterFloat = game.add.tileSprite(150,game.world.height/2.2,128,20,'floatplatform');
    platforms.add(leftCenterFloat);

    leftUpperFloat = game.add.tileSprite(-15,game.world.height/4,128,20,'floatplatform');
    platforms.add(leftUpperFloat);

    rightFloat = game.add.tileSprite(game.world.width - 128,game.world.height/1.5,128,20,'floatplatform');
    platforms.add(rightFloat);

    rightCenterFloat = game.add.tileSprite(game.world.width - 278,game.world.height/2.2,128,20,'floatplatform');
    platforms.add(rightCenterFloat);

    rightUpperFloat = game.add.tileSprite(game.world.width - 128,game.world.height/4,128,20,'floatplatform');
    platforms.add(rightUpperFloat);
  }
};

var controls = function(){
  var cursors = game.input.keyboard.createCursorKeys();
  var attackkey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  var wasd = {
    up: game.input.keyboard.addKey(Phaser.Keyboard.W),
    left: game.input.keyboard.addKey(Phaser.Keyboard.A),
    right: game.input.keyboard.addKey(Phaser.Keyboard.D),
    down: game.input.keyboard.addKey(Phaser.Keyboard.S)
  };
  var attackkey2 = game.input.keyboard.addKey(Phaser.Keyboard.TAB);

  sprite1.anchor.setTo(0.5,0.5);
  sprite1.body.velocity.x = 0;

  sprite2.anchor.setTo(0.5,0.5);
  sprite2.body.velocity.x = 0;

  if (cursors.right.isDown){
    sprite1.body.velocity.x = 150;
    Character.movement.runRight(sprite1);
  }else if(cursors.left.isDown){
    sprite1.body.velocity.x = -150;
    Character.movement.runLeft(sprite1);
  }else{
    sprite1.animations.stop();
  }
  if(cursors.up.isDown && sprite1.body.velocity.y === 0){
    sprite1.body.velocity.y = -400;
  }
  if(sprite1.body.velocity.y < 0){
    Character.movement.jump(sprite1);
  }else if(sprite1.body.velocity.y > 0){
    Character.movement.fall(sprite1);
  }
  if(attackkey.isDown){
    Character.movement.attack(sprite1);
  }

  if (wasd.right.isDown){
    sprite2.body.velocity.x = 150;
    Character.movement.runRight(sprite2);
  }else if(wasd.left.isDown){
    sprite2.body.velocity.x = -150;
    Character.movement.runLeft(sprite2);
  }else{
    sprite2.animations.stop();
  }
  if(wasd.up.isDown && sprite2.body.velocity.y === 0){
    sprite2.body.velocity.y = -400;
  }
  if(sprite2.body.velocity.y < 0){
    Character.movement.jump(sprite2);
  }else if(sprite2.body.velocity.y > 0){
    Character.movement.fall(sprite2);
  }
  if(attackkey2.isDown){
    Character.movement.attack(sprite2);
  }
};
