import PhaserRandomMoveDecider from "../phaseradaptor/phaserRandomMoveDecider";
import GhostPossibleMovesFinder from "../model/ghostPossibleMovesFinder";
import Ghost from "../model/ghost";
import PhaserGhost from "../phaseradaptor/phaserghost";
import * as Constants from '../model/constants';


export default class SpawnGhostsAction {
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
            let possibleMovesFinder = new GhostPossibleMovesFinder();            
            let ghostModel = new Ghost(this.mapAdaptor, 500, 0, phaserRandomMoveDecider, possibleMovesFinder, true);
            ghostModel.setPosX(this.config.spawnGhosts.spawnX);
            ghostModel.setPosY(this.config.spawnGhosts.spawnY);
            let phaserGhost = new PhaserGhost(this.scene, this.tilesize, this.spriteName, ghostModel, this.mazeOffsetY);
            ghostModel.setDestroyListener(phaserGhost);
            this.game.addGhost(phaserGhost);            
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