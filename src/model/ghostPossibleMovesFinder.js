import * as Constants from './constants';

export default class GhostPossibleMovesFinder {

    canMoveTo(tile) {
        return tile===Constants.MAP_FREE || tile===Constants.MAP_DOT;
    }

    findPossibleMoves(map, currentPosX, currentPosY, currentDirection) {
        var canMove = {};
        canMove[Constants.DIRECTION_RIGHT] = this.canMoveTo(map.getTileAt(currentPosX+1,currentPosY));
        canMove[Constants.DIRECTION_DOWN] = this.canMoveTo(map.getTileAt(currentPosX,currentPosY+1));
        canMove[Constants.DIRECTION_LEFT] = this.canMoveTo(map.getTileAt(currentPosX-1,currentPosY));
        canMove[Constants.DIRECTION_UP] = this.canMoveTo(map.getTileAt(currentPosX,currentPosY-1));

        var wasHeading = currentDirection;

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
}