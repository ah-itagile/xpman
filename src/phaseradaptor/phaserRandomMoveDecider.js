export default class PhaserRandomMoveDecider {
    chooseMove(options, ghost, player) {
        return Phaser.Math.RND.pick(options);
    }
}