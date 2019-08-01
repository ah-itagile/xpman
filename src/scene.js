import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import tilesImg from "./assets/super-mario.png";
import playerImg from "./assets/player16x16.png";
import securityImg from "./assets/security.png";
import tileMapCsv from "./assets/stadium-tilemap.csv";



export default class MyScene extends Phaser.Scene {

  constructor (config) {
      super(config);

  this.lastPlayerUpdate=0;
  this.playerSpeedDelay = 500;
  this.player;
  this.security;
  this.securityX = 2;
  this.securityY = 14;
  this.securityHeading = Phaser.RIGHT;
  this.securityDirection = Phaser.RIGHT;
  this.tilesize = 16;
  this.offset = (this.tilesize / 2)
  this.map;
  this.EMPTY_FIELD = 33;
  this.OCCUPIED_FIELD = 11;
  }

  init(data) {}
  // preload () {
  //   this.load.image("logo", logoImg);
  // }
  // // create (data)  {
  //   const logo = this.add.image(400, 150, "logo");

  //   this.tweens.add({
  //     targets: logo,
  //     y: 450,
  //     duration: 2000,
  //     ease: "Power2",
  //     yoyo: true,
  //     loop: -1
  //   });
  // }
  // update(time, delta) {}


  
  preload ()
  {
      this.load.image('tiles', tilesImg);
      this.load.image('player', playerImg);
      this.load.image('security', securityImg);
      this.load.tilemapCSV('map', tileMapCsv);
  }
  
  create ()
  {
      this.map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16 });
      var tileset = this.map.addTilesetImage('tiles', null, 16, 16, 0, 0);
      var layer = this.map.createStaticLayer(0, tileset, 0, 0);
  
      var player = this.add.image(32+16, 32+16, 'player');
      this.security = this.add.image(this.securityX*this.tilesize+this.offset, this.securityY*this.tilesize+this.offset, 'security');    
  
      //  Left
      this.input.keyboard.on('keydown_A', function (event) {
  
          var tile = layer.getTileAtWorldXY(player.x - 32, player.y, true);
  
          if (tile.index === 2)
          {
              //  Blocked, we can't move
          }
          else
          {
              player.x -= 32;
              player.angle = 180;
          }
  
      });
  
      //  Right
      this.input.keyboard.on('keydown_D', function (event) {
  
          var tile = layer.getTileAtWorldXY(player.x + 32, player.y, true);
  
          if (tile.index === 2)
          {
              //  Blocked, we can't move
          }
          else
          {
              player.x += 32;
              player.angle = 0;
          }
  
      });
  
      //  Up
      this.input.keyboard.on('keydown_W', function (event) {
  
          var tile = layer.getTileAtWorldXY(player.x, player.y - 32, true);
  
          if (tile.index === 2)
          {
              //  Blocked, we can't move
          }
          else
          {
              player.y -= 32;
              player.angle = -90;
          }
  
      });
  
      //  Down
      this.input.keyboard.on('keydown_S', function (event) {
  
          var tile = layer.getTileAtWorldXY(player.x, player.y + 32, true);
  
          if (tile.index === 2)
          {
              //  Blocked, we can't move
          }
          else
          {
              player.y += 32;
              player.angle = 90;
          }
  
      });
  
  }
  
  update(time, delta) {
      if (this.lastPlayerUpdate+this.playerSpeedDelay < time) {
          this.lastPlayerUpdate = time;
          var x = this.securityX;
          var y = this.securityY;
          var canMove = {};
          canMove[Phaser.LEFT] = this.map.getTileAt(x-1,y).index === this.EMPTY_FIELD;//(map[y][x - 1] === 0);
          canMove[Phaser.RIGHT] = this.map.getTileAt(x+1,y).index === this.EMPTY_FIELD;;//(map[y][x + 1] === 0);
          canMove[Phaser.UP] = this.map.getTileAt(x,y-1).index === this.EMPTY_FIELD;;//(map[y - 1][x] === 0 || map[y - 1][x] === 12);
          canMove[Phaser.DOWN] = this.map.getTileAt(x,y+1).index === this.EMPTY_FIELD;;//(map[y + 1][x] === 0);
  
          var wasHeading = this.securityDirection;
  
          var options = [];
  
          if (canMove[Phaser.LEFT] && wasHeading !== Phaser.RIGHT)
          {
              options.push(Phaser.LEFT);
          }
  
          if (canMove[Phaser.RIGHT] && wasHeading !== Phaser.LEFT)
          {
              options.push(Phaser.RIGHT);
          }
  
          if (canMove[Phaser.UP] && wasHeading !== Phaser.DOWN)
          {
              options.push(Phaser.UP);
          }
  
          if (canMove[Phaser.DOWN] && wasHeading !== Phaser.UP)
          {
              options.push(Phaser.DOWN);
          }
  
          this.securityDirection = Phaser.Math.RND.pick(options);
          
          switch (this.securityDirection)
          {
              case Phaser.LEFT:
                  this.securityX -= 1;
                  break;
              case Phaser.RIGHT:
                  this.securityX += 1;
                  break;
              case Phaser.UP:
                  this.securityY -= 1;
                  break;
              case Phaser.DOWN:
                  this.securityY += 1;
                  break;
          }
          this.security.x = this.securityX*this.tilesize+this.offset;
          this.security.y = this.securityY*this.tilesize+this.offset;
  
      }
  
  
  }
  
  

}