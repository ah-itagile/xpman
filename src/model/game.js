
export default class Game {
    constructor(map, ghost, player, endGameCallback) {
        this.map = map;
        this.ghost = ghost;
        this.player = player;
        this.initialDotCount = map.countDots();
        this.endGameCallback = endGameCallback;
    }

    update(time) {
        if (this.ghost.shouldUpdateAtTime(time)) {
            this.ghost.update(time);
        }
        if (this.player.shouldUpdateAtTime(time)) {
            this.player.update(time);
        }
        if (this.player.getEatenDots()===this.initialDotCount) {
            this.endGameCallback();
        }
        if (this.ghost.getPosX()===this.player.getPosX() && this.ghost.getPosY()===this.player.getPosY()) {
            this.player.decreaseLives();
            console.log("Lives left:" + this.player.getLivesLeft());
        }
    }
}