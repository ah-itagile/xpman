import Game from '../src/model/game';
import Player from '../src/model/player';

describe("Game", ()=>{
    it("should update ghosts and player during update loop", ()=>{
        let map = { countDots: () => { return 1; }}; 
        let ghost = jasmine.createSpyObj("ghost", {shouldUpdateAtTime: true, update:()=>{},
            getPosX: 0, getPosY: 0});
        let player = jasmine.createSpyObj("player", {shouldUpdateAtTime: true, update:()=>{}, getEatenDots: ()=>{return 1;},
            getPosX: 1, getPosY: 1});
        let game = new Game(map, ghost, player);

        game.update();

        expect(ghost.shouldUpdateAtTime).toHaveBeenCalled();
        expect(ghost.update).toHaveBeenCalled();
        expect(player.shouldUpdateAtTime).toHaveBeenCalled();
        expect(player.update).toHaveBeenCalled();
    });

    it("should fire end game event if player ate all dots", ()=>{
        let map = { countDots: () => { return 1; }};        
        let ghost = jasmine.createSpyObj("ghost", {shouldUpdateAtTime: true, update:()=>{},
            getPosX: 0, getPosY: 0});
        let player = jasmine.createSpyObj("player", {shouldUpdateAtTime: true, update:()=>{}, 
            getEatenDots: 1, getPosX: 1, getPosY: 1 }
        );
        let endGameCallback = jasmine.createSpy("endGameCallback");
        let game = new Game(map, ghost, player, endGameCallback);

        game.update();

        expect(endGameCallback).toHaveBeenCalled();
    });

    it("should decrease player lives if ghost catches player", ()=>{
        let map = { countDots: () => { return 1; }};        
        let ghost = jasmine.createSpyObj("ghost", {shouldUpdateAtTime: true, update:()=>{},
                        getPosX: 0, getPosY: 0});

        let initialLives = 2;                    
        let player = new Player(map, {}, 0, 0, 0, initialLives);      

        let game = new Game(map, ghost, player, ()=>{});

        game.update();

        expect(player.getLivesLeft()).toBe(1);
    });

});