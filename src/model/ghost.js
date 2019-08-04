
import Constants from 'constants';

export default class Ghost {

    constructor(){
        this.posX = 0;
        this.posY = 0;
        this.direction = Constants.UP;
    }

    getPosX() {
        return this.posX;
    }

    getPosY() {
        return this.posY;
    }

    getDirection() {
        return this.direction;
    }
}