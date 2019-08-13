import Game from '../src/model/game'

describe("Game", ()=>{
    it("should update ghosts and player during update loop", ()=>{
        let map = {};
        let ghost = jasmine.createSpyObj("ghost", {shouldUpdateAtTime: true, update:()=>{}});
        let player = jasmine.createSpyObj("player", {shouldUpdateAtTime: true, update:()=>{}});
        let game = new Game(map, ghost, player);

        game.update();

        expect(ghost.shouldUpdateAtTime).toHaveBeenCalled();
        expect(ghost.update).toHaveBeenCalled();
        expect(player.shouldUpdateAtTime).toHaveBeenCalled();
        expect(player.update).toHaveBeenCalled();
    });
});