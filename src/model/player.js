import * as Constants from './constants'

export default class Player {
    constructor(map, controls, waitTimeWithoutMovementInMs, waitTimeAfterMovementInMs, lastUpdatedAtInMs, pairProgrammingTimeSpan) {
        this.map = map;
        this.controls = controls;
        this.posX = 0;
        this.posY = 0;
        this.waitTimeWithoutMovementInMs = waitTimeWithoutMovementInMs;
        this.waitTimeInMs = waitTimeWithoutMovementInMs;
        this.waitTimeAfterMovementInMs = waitTimeAfterMovementInMs;
        this.lastUpdatedAtInMs = lastUpdatedAtInMs;
        this.eatenDots = 0;
        this.isPairProgramming = false;
        this.pairProgrammingTimeSpan = pairProgrammingTimeSpan;
        this.movements = [
            {name: 'up', dx: 0, dy:-1},
            {name: 'down', dx: 0, dy:1},
            {name: 'left', dx: -1, dy:0},
            {name: 'right', dx: +1, dy:0},
        ];
    }
 
    setDotEatenEventListener(dotEatenEventListener) {
        this.dotEatenEventListener = dotEatenEventListener;
    }

    getPairProgramming() {
        return this.isPairProgramming;
    }

    setPairProgramming(isPairProgramming) {
        this.isPairProgramming = isPairProgramming;
    }

    getLeftPairProgrammingTime(time) {
        return this.pairProgrammingTimeSpan - (time-this.startedPairprogrammingTime);
    }

    shouldUpdateAtTime(time) {
        return this.lastUpdatedAtInMs+this.waitTimeInMs <= time;
    }

    update(time) {
        this.waitTimeInMs = this.waitTimeWithoutMovementInMs;
        
        if (this.getPairProgramming()) {
            if (this.getLeftPairProgrammingTime(time)<=0) {
                this.setPairProgramming(false);
            }
        }

        this.movePlayer(time);

        this.lastUpdatedAtInMs = time;
    }

    movePlayer(time) {
        let executedAMovement = false;
        this.movements.forEach((movement) => {
            if (!executedAMovement && this.controls[movement.name]()) {
                if (this.map.getTileAt(this.posX + movement.dx, this.posY + movement.dy) !== Constants.MAP_WALL) {
                    this.posX += movement.dx;
                    this.posY += movement.dy;

                    this.checkForPairProgramming(time);
                    this.checkForEatingStorypoing();

                    executedAMovement = true;
                    this.waitTimeInMs = this.waitTimeAfterMovementInMs;
                }
            }
        });
    }

    checkForEatingStorypoing() {
        if (this.map.getTileAt(this.posX, this.posY) === Constants.MAP_DOT) {
            this.map.replaceTile(this.posX, this.posY, Constants.MAP_FREE);
            this.eatenDots++;
            this.dotEatenEventListener();
        }
    }

    checkForPairProgramming(time) {
        if (this.map.getTileAt(this.posX, this.posY) === Constants.MAP_PAIRPROG) {
            this.map.replaceTile(this.posX, this.posY, Constants.MAP_FREE);
            this.setPairProgramming(true);
            this.startedPairprogrammingTime = time;
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

    getSpeed() {
        return this.waitTimeInMs;
    }

    getEatenDots() {
        return this.eatenDots;
    }
    
}