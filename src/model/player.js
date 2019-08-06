import * as Constants from './constants'

export default class Player {
    constructor(map, controls, waitTimeWithoutMovementInMs, waitTimeAfterMovementInMs, lastUpdatedAtInMs) {
        this.map = map;
        this.controls = controls;
        this.posX = 0;
        this.posY = 0;
        this.waitTimeWithoutMovementInMs = waitTimeWithoutMovementInMs;
        this.waitTimeInMs = waitTimeWithoutMovementInMs;
        this.waitTimeAfterMovementInMs = waitTimeAfterMovementInMs;
        this.lastUpdatedAtInMs = lastUpdatedAtInMs;
    }

    shouldUpdateAtTime(time) {
        return this.lastUpdatedAtInMs+this.waitTimeInMs <= time;
    }

    update(time) {
        this.waitTimeInMs = this.waitTimeWithoutMovementInMs;
        
        if (this.controls.up()) {
            this.posY--;
            this.waitTimeInMs = this.waitTimeAfterMovementInMs;
        }
        if (this.controls.left()) {
            this.posX--;
            this.waitTimeInMs = this.waitTimeAfterMovementInMs;
        }
        if (this.controls.down()) {
            this.posY++;
            this.waitTimeInMs = this.waitTimeAfterMovementInMs;
        }
        if (this.controls.right()) {
            this.posX++;
            this.waitTimeInMs = this.waitTimeAfterMovementInMs;
        }
        this.lastUpdatedAtInMs = time;
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