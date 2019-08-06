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
        this.movements = [
            {name: 'up', dx: 0, dy:-1},
            {name: 'down', dx: 0, dy:1},
            {name: 'left', dx: -1, dy:0},
            {name: 'right', dx: +1, dy:0},
        ];
    }
 
    shouldUpdateAtTime(time) {
        return this.lastUpdatedAtInMs+this.waitTimeInMs <= time;
    }

    update(time) {
        this.waitTimeInMs = this.waitTimeWithoutMovementInMs;
        
        this.movements.forEach((movement) => {
            if (this.controls[movement.name]()) {
                if (this.map.getTileAt(this.posX+movement.dx,this.posY+movement.dy) !== Constants.MAP_WALL) {
                    this.posX += movement.dx;
                    this.posY += movement.dy;
                    if (this.map.getTileAt(this.posX,this.posY) === Constants.MAP_PILL) {
                        this.map.replaceTile(this.posX,this.posY, Constants.MAP_FREE);
                    }

                    this.waitTimeInMs = this.waitTimeAfterMovementInMs;
                }
            }
        });

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