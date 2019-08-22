import PhaserRandomMoveDecider from "../phaseradaptor/phaserRandomMoveDecider";
import OpponentPossibleMovesFinder from "../model/opponentPossibleMovesFinder";
import Opponent from "../model/opponent";
import PhaserOpponent from "../phaseradaptor/phaseropponent";
import * as Constants from '../model/constants';


export default class SpawnOpponentsAction {
    constructor(waitTimeInMs, lastUpdatedAtInMs, initialCounter, decreaseBy, game, config, mapAdaptor, scene, tilesize, mazeOffsetY, counterDisplay, spriteName) {
        this.waitTimeInMs = waitTimeInMs;
        this.lastUpdatedAtInMs = lastUpdatedAtInMs;
        this.initialCounter = initialCounter;
        this.currentCounter = initialCounter;
        this.decreaseBy = decreaseBy;
        this.game = game;
        this.mapAdaptor = mapAdaptor;
        this.scene = scene;
        this.tilesize = tilesize;
        this.mazeOffsetY = mazeOffsetY
        this.config = config;
        this.counterDisplay = counterDisplay;
        this.spriteName = spriteName;
    }

    shouldUpdateAtTime(time) {
        return this.lastUpdatedAtInMs+this.waitTimeInMs < time;
    }

    playerSteppedOn(tile) {
        if (tile===Constants.MAP_CI_SERVER) {
            this.reset();
        }
    }

    update(time) {
        this.lastUpdatedAtInMs = time;
        this.currentCounter -= this.decreaseBy;

        if (this.currentCounter <= 0) {
            let phaserRandomMoveDecider = new PhaserRandomMoveDecider();
            let possibleMovesFinder = new OpponentPossibleMovesFinder();            
            let opponentModel = new Opponent(this.mapAdaptor, 500, 0, phaserRandomMoveDecider, possibleMovesFinder, true);
            opponentModel.setPosX(this.config.spawnOpponents.spawnX);
            opponentModel.setPosY(this.config.spawnOpponents.spawnY);
            let phaserOpponent = new PhaserOpponent(this.scene, this.tilesize, this.spriteName, opponentModel, this.mazeOffsetY);
            opponentModel.setDestroyListener(phaserOpponent);
            this.game.addOpponent(phaserOpponent);            
            this.currentCounter = this.initialCounter;        
        }

        this.showMessage();
    }

    showMessage() {
        this.counterDisplay.showMessage("CI Countdown:" + this.currentCounter);
    }

    reset() {
        this.currentCounter = this.initialCounter;
        this.showMessage();
    }
}