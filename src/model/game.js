
export default class Game {
    constructor(map, ghosts, player, endGameCallback) {
        this.map = map;
        this.ghosts = ghosts;
        this.player = player;
        this.initialDotCount = map.countDots();
        this.endGameCallback = endGameCallback;
    }

    update(time) {
        this.ghosts.forEach(ghost => {
            if (ghost.shouldUpdateAtTime(time)) {
                ghost.update(time);
            }
            if (ghost.getPosX()===this.player.getPosX() && ghost.getPosY()===this.player.getPosY()) {
                this.player.decreaseLives();
                console.log("Lives left:" + this.player.getLivesLeft());
            }
                    
        });
        if (this.player.shouldUpdateAtTime(time)) {
            this.player.update(time);
        }
        if (this.player.getEatenDots()===this.initialDotCount) {
            this.endGameCallback();
        }
    }
}