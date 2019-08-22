export default class XPManGame {
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

    setInitialOpponents(opponents) {
        this.initialOpponents = opponents; 
        this.opponents = [...opponents];
    }

    addOpponent(opponent) {
        this.opponents.push(opponent);
    }

    getOpponents() {
        return this.opponents;
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
        this.resetOpponentAndPlayerPositions();
    }

    continueAfterLifeLost() {
       this.timedActions.forEach(action =>{
            action.reset();
       } );
       this.resetOpponentAndPlayerPositions();
    }

    resetGame() {
        this.currentLevelOneBased = 1;
        this.points = 0;
        this.livesLeft = 2;
    }

    removeSpawnedOpponents() {
        for (let i=this.initialOpponents.length; i<this.opponents.length; i++) {
            this.opponents[i].destroy();
        }
        this.opponents = [...this.initialOpponents];
    }

    resetOpponentAndPlayerPositions() {
        this.removeSpawnedOpponents();        
        for (let i = 0; i < this.opponents.length; i++) {
            const opponent = this.opponents[i];
            opponent.setPosX(this.levels[this.currentLevelOneBased-1].opponents[i].posX);
            opponent.setPosY(this.levels[this.currentLevelOneBased-1].opponents[i].posY);
        }

        this.player.setPosX(this.levels[this.currentLevelOneBased-1].player.posX);
        this.player.setPosY(this.levels[this.currentLevelOneBased-1].player.posY);
    }

    opponentCaughtPlayer(opponentIndex) {
        if (this.player.getPairProgramming() && this.opponents[opponentIndex].getKillableByPairProgramming()) {
            this.opponents[opponentIndex].destroy();
            this.opponents.splice(opponentIndex,1);
        } else {
            this.livesLeft--;
            if (this.livesLeft<0) {
                this.gameOverCallback();
            } else {
                this.lifeLostDisplay.showMessage("YOU LOST ONE LIFE!");
            }
            this.playerLivesLeftDisplay.update(this.livesLeft);
        }
    }

    update(time, forceLevelEnd) {
        for (var g = this.opponents.length - 1; g >= 0; g--) {
            let opponent = this.opponents[g];
            if (opponent.shouldUpdateAtTime(time)) {
                opponent.update(time, this.player);
            }
        }
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
        for (var g = this.opponents.length - 1; g >= 0; g--) {
            this.checkForOpponentPlayerContact(g);                    
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

    checkForOpponentPlayerContact(g) {
        let opponent = this.opponents[g];
        if (opponent.getPosX() === this.player.getPosX() && opponent.getPosY() === this.player.getPosY()) {
            this.opponentCaughtPlayer(g);
        }
    }
}