export default class PhaserRandomMoveDecider {
    chooseMove(options, opponent, player) {
        return Phaser.Math.RND.pick(options);
    }
}