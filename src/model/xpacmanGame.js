export default class XPacmanGame {
    constructor() {
        this.currentLevelOneBased = 1;
        this.initialDotCount;
        this.points = 0;
        this.livesLeft = 2;
        this.timedActions = [];
    }

    setLevelConfigs(levelConfigs) {
        this.levels = levelConfigs;
    }

    setInitialGhosts(ghosts) {
        this.initialGhosts = ghosts; 
        this.ghosts = [...ghosts];
    }

    addGhost(ghost) {
        this.ghosts.push(ghost);
    }

    getGhosts() {
        return this.ghosts;
    }

    setPlayer(player) {
        this.player = player;
        this.player.setDotEatenEventListener(()=>{
            this.points++;
        });
    }

    setTimedActions(timedActions) {
        this.timedActions = timedActions;
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
       this.timedActions.forEach(action =>{
            action.reset();
       } );
       this.resetGhostAndPlayerPositions();
    }

    resetGame() {
        this.currentLevelOneBased = 1;
        this.points = 0;
        this.livesLeft = 2;
    }

    removeSpawnedGhosts() {
        for (let i=this.initialGhosts.length; i<this.ghosts.length; i++) {
            this.ghosts[i].destroy();
        }
        this.ghosts = [...this.initialGhosts];
    }

    resetGhostAndPlayerPositions() {
        this.removeSpawnedGhosts();        
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
        this.timedActions.forEach(timedAction => {
            if (timedAction.shouldUpdateAtTime(time)) {
                timedAction.update(time);
            }
        });
        if (this.player.shouldUpdateAtTime(time)) {
            this.player.update(time);
            this.pointsDisplay.update(this.points);
            this.timedActions.forEach(timedAction => {
                let tile = this.mapAdaptor.getTileAt(this.player.getPosX(), this.player.getPosY());
                timedAction.playerSteppedOn(tile);
            });
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