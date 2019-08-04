
import * as Constants from './constants';

export default class Ghost {

    constructor(){
        this.posX = 0;
        this.posY = 0;
        this.direction = Constants.DIRECTION_UP;
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

    findPossibleMoves(map) {
        var canMove = {};
        canMove[Constants.DIRECTION_RIGHT] = map.getTileAt(this.posX+1,this.posY) === Constants.MAP_FREE;
        canMove[Constants.DIRECTION_DOWN] = map.getTileAt(this.posX,this.posY+1) ===Constants.MAP_FREE;
        canMove[Constants.DIRECTION_LEFT] = map.getTileAt(this.posX-1,this.posY) === Constants.MAP_FREE;
        canMove[Constants.DIRECTION_UP] = map.getTileAt(this.posX,this.posY-1) ===Constants.MAP_FREE;

        var wasHeading = this.direction;

        var options = [];


        if (canMove[Constants.DIRECTION_RIGHT] && wasHeading !== Constants.DIRECTION_LEFT)
        {
            options.push(Constants.DIRECTION_RIGHT);
        }
        if (canMove[Constants.DIRECTION_LEFT] && wasHeading !== Constants.DIRECTION_RIGHT)
        {
            options.push(Constants.DIRECTION_LEFT);
        }
        if (canMove[Constants.DIRECTION_DOWN] && wasHeading !== Constants.DIRECTION_UP)
        {
            options.push(Constants.DIRECTION_DOWN);
        }
        if (canMove[Constants.DIRECTION_UP] && wasHeading !== Constants.DIRECTION_DOWN)
        {
            options.push(Constants.DIRECTION_UP);
        }

        return options;                    
    };
    
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