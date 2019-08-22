
import * as Constants from './constants';

export default class Opponent {

    constructor(map, waitTimeInMs, lastUpdatedAtInMs, moveDecider, possibleMovesFinder, isKillableByPairProgramming){
        this.posX = 0;
        this.posY = 0;
        this.direction = Constants.DIRECTION_UP;
        this.map = map;
        this.waitTimeInMs = waitTimeInMs;
        this.lastUpdatedAtInMs = lastUpdatedAtInMs;
        this.moveDecider = moveDecider;
        this.possibleMovesFinder = possibleMovesFinder;
        this.isKillableByPairProgramming = isKillableByPairProgramming;
    }

    setDestroyListener(destroyListener) {
        this.destroyListener = destroyListener;
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
    
    getDirection() {
        return this.direction;
    }
    
    setDirection(direction) {
        this.direction = direction;
    }

    getKillableByPairProgramming() {
        return this.isKillableByPairProgramming;
    }

    shouldUpdateAtTime(time) {
        return this.lastUpdatedAtInMs+this.waitTimeInMs < time;
    }

    update(time, player) {
        let options = this.possibleMovesFinder.findPossibleMoves(this.map, this.posX, this.posY, this.direction);
        let newDirection = this.moveDecider.chooseMove(options, this, player);
        this.setDirection(newDirection);          
        this.move(newDirection);
        this.lastUpdatedAtInMs = time;
    }

    destroy() {
        this.destroyListener.destroy();
    }
    
    move(direction) {
        switch (direction)
        {
            case Constants.DIRECTION_LEFT:
                this.posX -= 1;
                break;
            case Constants.DIRECTION_RIGHT:
                this.posX += 1;
                break;
            case Constants.DIRECTION_UP:
                this.posY -= 1;
                break;
            case Constants.DIRECTION_DOWN:
                this.posY += 1;
                break;
        }
    }
}