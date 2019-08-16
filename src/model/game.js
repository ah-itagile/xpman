import { throws } from "assert";

export default class Game {
    constructor(map, ghosts, player, endGameCallback, pointsDisplay, playerLivesLeftDisplay, gameOverCallback, lostLifeDisplay, levels) {
        this.map = map;
        this.ghosts = ghosts;
        this.player = player;
        this.initialDotCount = map.countDots();
        this.endGameCallback = endGameCallback;
        this.pointsDisplay = pointsDisplay;
        this.playerLivesLeftDisplay = playerLivesLeftDisplay;
        this.gameOverCallback = gameOverCallback;
        this.lostLifeDisplay = lostLifeDisplay;
        this.levels = levels;
    }

    initialize() {
        this.pointsDisplay.update(this.player.getEatenDots());
        this.playerLivesLeftDisplay.update(this.player.getLivesLeft());
        this.resetGhostAndPlayerPositions();
    }

    continueAfterLifeLost() {
       this.resetGhostAndPlayerPositions();
    }

    resetGhostAndPlayerPositions() {
        for (let i = 0; i < this.ghosts.length; i++) {
            const ghost = this.ghosts[i];
            ghost.setPosX(this.levels[0].ghosts[i].posX);
            ghost.setPosY(this.levels[0].ghosts[i].posY);
        }

        this.player.setPosX(this.levels[0].player.posX);
        this.player.setPosY(this.levels[0].player.posY);
    }

    ghostCaughtPlayer() {
        this.player.decreaseLives();
        if (this.player.getLivesLeft()<0) {
            this.gameOverCallback();
        } else {
            this.lostLifeDisplay.showMessage("YOU LOST ONE LIFE!");
        }
        this.playerLivesLeftDisplay.update(this.player.getLivesLeft());
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