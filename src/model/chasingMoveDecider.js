import * as Constants from './constants';

export default class ChasingMoveDecider {

    constructor(fallbackMoveDecider) {
        this.fallbackMoveDecider = fallbackMoveDecider;
    }

    chooseMove(options, opponent, player) {
        let possibleOptions = [];
        if (opponent.getPosX()> player.getPosX()) {
            if (options.includes(Constants.DIRECTION_LEFT)) {
                possibleOptions.push(Constants.DIRECTION_LEFT);
            }
        } 
        if (opponent.getPosX()< player.getPosX()) {
            if (options.includes(Constants.DIRECTION_RIGHT)) {
                possibleOptions.push(Constants.DIRECTION_RIGHT);
            }
        }
        if (opponent.getPosY()> player.getPosY()) {
            if (options.includes(Constants.DIRECTION_UP)) {
                possibleOptions.push(Constants.DIRECTION_UP);
            }
        }
        if (opponent.getPosY()< player.getPosY()) {
            if (options.includes(Constants.DIRECTION_DOWN)) {
                possibleOptions.push(Constants.DIRECTION_DOWN);
            }
        }
        if (possibleOptions.length === 1){
            return possibleOptions[0];
        } 
        if (possibleOptions.length===0) {
            possibleOptions = options;
        }
        // The current direction will not be regarded as a preferred direction for the fallback decider.
        // Should a chaser prefer the current direction if no chasing direction is possible?
        return this.fallbackMoveDecider.chooseMove(possibleOptions, opponent, player);
    }
}