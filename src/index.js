import Phaser from "phaser";
import MyScene from "./scene.js";


const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: MyScene
};

const game = new Phaser.Game(config);

