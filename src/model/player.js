import * as Constants from './constants'

export default class Player {
    constructor(map, controls) {
        this.map = map;
        this.controls = controls;
        this.posX = 0;
        this.posY = 0;     
    }

    update() {
        if (this.controls.up()) {
            this.posY--;
        }
        if (this.controls.left()) {
            this.posX--;
        }
        if (this.controls.down()) {
            this.posY++;
        }
        if (this.controls.right()) {
            this.posX++;
        }
    }

    getPosX() {
        return this.posX;
    }

    setPosX(x) {
        this.posX = x;
    }
    
    getPosY() {
        return this.posY;
    }
    
    setPosY(y) {
        this.posY = y;
    }
    
}