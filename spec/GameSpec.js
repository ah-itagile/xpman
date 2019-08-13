import Game from '../src/model/game'

describe("Game", ()=>{
    it("should update ghosts and player during update loop", ()=>{
        let map = { countDots: () => { return 1; }}; 
        let ghost = jasmine.createSpyObj("ghost", {shouldUpdateAtTime: true, update:()=>{}});
        let player = jasmine.createSpyObj("player", {shouldUpdateAtTime: true, update:()=>{}, getEatenDots: ()=>{return 1;}});
        let game = new Game(map, ghost, player);

        game.update();

        expect(ghost.shouldUpdateAtTime).toHaveBeenCalled();
        expect(ghost.update).toHaveBeenCalled();
        expect(player.shouldUpdateAtTime).toHaveBeenCalled();
        expect(player.update).toHaveBeenCalled();
    });

    it("should fire end game event if player ate all dots", ()=>{
        let map = { countDots: () => { return 1; }};        
        let ghost = jasmine.createSpyObj("ghost", {shouldUpdateAtTime: true, update:()=>{}});
        let player = jasmine.createSpyObj("player", {shouldUpdateAtTime: true, update:()=>{}, 
            getEatenDots: 1 }
        );
        let endGameCallback = jasmine.createSpy("endGameCallback");
        let game = new Game(map, ghost, player, endGameCallback);

        game.update();

        expect(endGameCallback).toHaveBeenCalled();
    });

});