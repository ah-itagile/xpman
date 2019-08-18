
import * as Constants from './constants';
import GhostPossibleMovesFinder from './ghostPossibleMovesFinder';

export default class Ghost {

    constructor(map, waitTimeInMs, lastUpdatedAtInMs, moveDecider, possibleMovesFinder){
        this.posX = 0;
        this.posY = 0;
        this.direction = Constants.DIRECTION_UP;
        this.map = map;
        this.waitTimeInMs = waitTimeInMs;
        this.lastUpdatedAtInMs = lastUpdatedAtInMs;
        this.moveDecider = moveDecider;
        this.possibleMovesFinder = possibleMovesFinder;
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
    
    getDirection() {
        return this.direction;
    }
    
    setDirection(direction) {
        this.direction = direction;
    }

    shouldUpdateAtTime(time) {
        return this.lastUpdatedAtInMs+this.waitTimeInMs < time;
    }

    update(time) {
        let options = this.possibleMovesFinder.findPossibleMoves(this.map, this.posX, this.posY, this.direction);
        let newDirection = this.moveDecider.chooseMove(options, this, null);
        this.setDirection(newDirection);          
        this.move(newDirection);
        this.lastUpdatedAtInMs = time;
    }

    canMoveTo(tile) {
        return tile===Constants.MAP_FREE || tile===Constants.MAP_DOT;
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