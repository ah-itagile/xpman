export default class PairProgrammingTimedAction {

    constructor(waitTimeInMs, lastUpdatedAtInMs, player, pairprogrammingTimeSpan, display) {
        this.player = player;
        this.pairprogrammingTimeSpan = pairprogrammingTimeSpan;
        this.startedPairProgramming = 0;
        this.display = display;
        this.waitTimeInMs = waitTimeInMs;
        this.lastUpdatedAtInMs = lastUpdatedAtInMs;
    }

    shouldUpdateAtTime(time) {
        return this.lastUpdatedAtInMs+this.waitTimeInMs < time;
    }

    playerSteppedOn(tile) {}

    update(time) {       
        this.lastUpdatedAtInMs = time; 
        if (this.player.getPairProgramming()) {
            this.display.update(this.player.getLeftPairProgrammingTime(time));
        } else {
            this.display.showNothing();
        }
    }

    reset() {
        this.display.showNothing();
    }

}