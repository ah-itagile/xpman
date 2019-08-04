
import * as Constants from './constants';

export default class Ghost {

    constructor(){
        this.posX = 0;
        this.posY = 0;
        this.direction = Constants.UP;
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
        // canMove[Constants.DIRECTION_LEFT] = this.map.getTileAt(x-1,y).index === this.EMPTY_FIELD;//(map[y][x - 1] === 0);
        canMove[Constants.DIRECTION_RIGHT] = map.getTileAt(this.posX+1,this.posY) === Constants.MAP_FREE;
        // canMove[Phaser.UP] = this.map.getTileAt(x,y-1).index === this.EMPTY_FIELD;;//(map[y - 1][x] === 0 || map[y - 1][x] === 12);
        canMove[Constants.DIRECTION_DOWN] = map.getTileAt(this.posX,this.posY+1) ===Constants.MAP_FREE;

        var wasHeading = this.direction;

        var options = [];

        // if (canMove[Phaser.LEFT] && wasHeading !== Phaser.RIGHT)
        // {
        //     options.push(Phaser.LEFT);
        // }

        if (canMove[Constants.DIRECTION_RIGHT] && wasHeading !== Constants.DIRECTION_LEFT)
        {
            options.push(Constants.DIRECTION_RIGHT);
        }

        // if (canMove[Phaser.UP] && wasHeading !== Phaser.DOWN)
        // {
        //     options.push(Phaser.UP);
        // }

        if (canMove[Constants.DIRECTION_DOWN] && wasHeading !== Constants.DIRECTION_UP)
        {
            options.push(Constants.DIRECTION_DOWN);
        }

        return options;                    
    };
}