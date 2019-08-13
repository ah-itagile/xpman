
export default class Game {
    constructor(map, ghost, player) {
        this.map = map;
        this.ghost = ghost;
        this.player = player;
    }

    update(time) {
        if (this.ghost.shouldUpdateAtTime(time)) {
            this.ghost.update(time);
          }
          if (this.player.shouldUpdateAtTime(time)) {
            this.player.update(time);
          }
    }
}