export default class XPacmanGame {
    constructor() {
        this.currentLevelOneBased = 1;
        this.initialDotCount;
        this.points = 0;
        this.livesLeft = 2;
    }

    setLevelConfigs(levelConfigs) {
        this.levels = levelConfigs;
    }

    setGhosts(ghosts) {
        this.ghosts = ghosts;
    }

    setPlayer(player) {
        this.player = player;
        this.player.setDotEatenEventListener(()=>{
            this.points++;
        });
    }

    setMapAdaptor(mapAdaptor) {
        this.mapAdaptor = mapAdaptor;   
    }

    setLevelFinishedCallback(levelFinishedCallback) {
        this.levelFinishedCallback = levelFinishedCallback;
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

    getCurrentLevel() {
        return this.currentLevelOneBased;
    }

    initializeLevel() {
        this.initialDotCount = this.mapAdaptor.countDots();
        this.pointsDisplay.update(this.player.getEatenDots());
        this.playerLivesLeftDisplay.update(this.livesLeft);
        this.resetGhostAndPlayerPositions();
    }

    continueAfterLifeLost() {
       this.resetGhostAndPlayerPositions();
    }

    resetGame() {
        this.currentLevelOneBased = 1;
        this.points = 0;
        this.livesLeft = 2;
    }

    resetGhostAndPlayerPositions() {
        for (let i = 0; i < this.ghosts.length; i++) {
            const ghost = this.ghosts[i];
            ghost.setPosX(this.levels[this.currentLevelOneBased-1].ghosts[i].posX);
            ghost.setPosY(this.levels[this.currentLevelOneBased-1].ghosts[i].posY);
        }

        this.player.setPosX(this.levels[this.currentLevelOneBased-1].player.posX);
        this.player.setPosY(this.levels[this.currentLevelOneBased-1].player.posY);
    }

    ghostCaughtPlayer() {
        this.livesLeft--;
        if (this.livesLeft<0) {
            this.gameOverCallback();
        } else {
            this.lifeLostDisplay.showMessage("YOU LOST ONE LIFE!");
        }
        this.playerLivesLeftDisplay.update(this.livesLeft);
    }

    update(time, forceLevelEnd) {
        this.ghosts.forEach(ghost => {
            if (ghost.shouldUpdateAtTime(time)) {
                ghost.update(time, this.player);
            }
            if (ghost.getPosX()===this.player.getPosX() && ghost.getPosY()===this.player.getPosY()) {
                this.ghostCaughtPlayer();
            }
                    
        });
        if (this.player.shouldUpdateAtTime(time)) {
            this.player.update(time);
            this.pointsDisplay.update(this.points);
        }
        if (this.player.getEatenDots()===this.initialDotCount || forceLevelEnd) {
            if (this.currentLevelOneBased == this.levels.length) {
                this.endGameCallback();
            } else
            {
                this.currentLevelOneBased++;
                this.levelFinishedCallback();
            }
        }
    }
}