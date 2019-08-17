export default class XPacmanGame {
    constructor(levels) {
        this.initialDotCount;
        this.levels = levels;
    }

    setGhosts(ghosts) {
        this.ghosts = ghosts;
    }

    setPlayer(player) {
        this.player = player;
    }

    setMapAdaptor(mapAdaptor) {
        this.mapAdaptor = mapAdaptor;   
    }

    setEndGameCallback(endGameCallback) {
        this.endGameCallback = endGameCallback;
    }

    setPlayerLivesLeftDisplay(playerLivesLeftDisplay) {
        this.playerLivesLeftDisplay = playerLivesLeftDisplay;
    }

    setGameOverCallback(gameOverCallback) {
        this.gameOverCallback = gameOverCallback;
    }

    setLifeLostDisplay(lifeLostDisplay) {
        this.lifeLostDisplay = lifeLostDisplay;
    }

    setPointsDisplay(pointsDisplay) {
        this.pointsDisplay = pointsDisplay;
    }

    getLevelConfigs() {
        return this.levels;
    }

    initialize() {
        this.pointsDisplay.update(this.player.getEatenDots());
        this.playerLivesLeftDisplay.update(this.player.getLivesLeft());
        this.resetGhostAndPlayerPositions();
    }

    continueAfterLifeLost() {
       this.resetGhostAndPlayerPositions();
    }

    resetLevel() {
        this.initialDotCount = this.mapAdaptor.countDots();
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
            this.lifeLostDisplay.showMessage("YOU LOST ONE LIFE!");
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