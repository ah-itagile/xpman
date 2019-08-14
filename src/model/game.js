
export default class Game {
    constructor(map, ghosts, player, endGameCallback, pointsDisplay) {
        this.map = map;
        this.ghosts = ghosts;
        this.player = player;
        this.initialDotCount = map.countDots();
        this.endGameCallback = endGameCallback;
        this.pointsDisplay = pointsDisplay;
    }

    update(time, forceLevelEnd) {
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
            this.pointsDisplay.update(this.player.getEatenDots());
        }
        if (this.player.getEatenDots()===this.initialDotCount || forceLevelEnd) {
            this.endGameCallback();
        }
    }
}