import Phaser from "phaser";
import logoImg from "./assets/logo.png";


export default class MyScene extends Phaser.Scene {

  constructor (config) {
      super(config);
  }

  init(data) {}
  preload () {
    this.load.image("logo", logoImg);
  }
  create (data)  {
    const logo = this.add.image(400, 150, "logo");

    this.tweens.add({
      targets: logo,
      y: 450,
      duration: 2000,
      ease: "Power2",
      yoyo: true,
      loop: -1
    });
  }
  update(time, delta) {}

}