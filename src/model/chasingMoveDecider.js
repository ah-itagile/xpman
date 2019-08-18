import * as Constants from './constants';

export default class ChasingMoveDecider {

    constructor(fallbackMoveDecider) {
        this.fallbackMoveDecider = fallbackMoveDecider;
    }

    chooseMove(options, ghost, player) {
        if (ghost.getPosX()> player.getPosX()) {
            if (options.includes(Constants.DIRECTION_LEFT)) {
                return Constants.DIRECTION_LEFT;
            }
        } 
        if (ghost.getPosX()< player.getPosX()) {
            if (options.includes(Constants.DIRECTION_RIGHT)) {
                return Constants.DIRECTION_RIGHT;
            }
        }
        if (ghost.getPosY()> player.getPosY()) {
            if (options.includes(Constants.DIRECTION_UP)) {
                return Constants.DIRECTION_UP;
            }
        }
        if (ghost.getPosY()< player.getPosY()) {
            if (options.includes(Constants.DIRECTION_DOWN)) {
                return Constants.DIRECTION_DOWN;
            }
        }
        return this.fallbackMoveDecider.chooseMove(options, ghost, player);
    }
}