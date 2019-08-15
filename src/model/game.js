
export default class Game {
    constructor(map, ghosts, player, endGameCallback, pointsDisplay, playerLivesDisplay, gameOverCallback) {
        this.map = map;
        this.ghosts = ghosts;
        this.player = player;
        this.initialDotCount = map.countDots();
        this.endGameCallback = endGameCallback;
        this.pointsDisplay = pointsDisplay;
        this.playerLivesDisplay = playerLivesDisplay;
        this.gameOverCallback = gameOverCallback;
    }

    create() {
        this.pointsDisplay.update(this.player.getEatenDots());
    }

    ghostCaughtPlayer() {
        this.player.decreaseLives();
        if (this.player.getLivesLeft()<0) {
            this.gameOverCallback();
        }
        this.playerLivesDisplay.update(this.player.getLivesLeft());
    }

    update(time, forceLevelEnd) {
        this.ghosts.forEach(ghost => {
            if (ghost.shouldUpdateAtTime(time)) {
                ghost.update(time);
            }
            if (ghost.getPosX()===this.player.getPosX() && ghost.getPosY()===this.player.getPosY()) {
                this.ghostCaughtPlayer();
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