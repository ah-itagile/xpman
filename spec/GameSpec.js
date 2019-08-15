import Game from '../src/model/game';
import Player from '../src/model/player';

describe("Game", ()=>{

    let pointsDisplay;
    let endGameCallback;

    beforeEach(()=>{
        pointsDisplay = { update: ()=> {}};
        endGameCallback = () => {}; 
    });

    it("should initialize on creation", ()=>{
        let map = { countDots: () => { return 1; }};
        let player = { getEatenDots: ()=>1, getLivesLeft: ()=> 2 };
        let endGameCallback = jasmine.createSpy();
        let pointsDisplay = jasmine.createSpyObj("pointsDisplay", ["update"]);
        let playerLivesLeftDisplay = jasmine.createSpyObj("playerLivesLeftDisplay", ["update"]);
        let game = new Game(map, [], player, endGameCallback, pointsDisplay, playerLivesLeftDisplay);        

        game.initialize();

        expect(pointsDisplay.update).toHaveBeenCalledWith(1);
        expect(playerLivesLeftDisplay.update).toHaveBeenCalledWith(2);
    });

    it("should update all ghosts and player during update loop", ()=>{
        let map = { countDots: () => { return 1; }}; 
        let ghost1 = jasmine.createSpyObj("ghost1", {shouldUpdateAtTime: true, update:()=>{},
            getPosX: 0, getPosY: 0});
        let ghost2 = jasmine.createSpyObj("ghost2", {shouldUpdateAtTime: true, update:()=>{},
            getPosX: 0, getPosY: 0});
        let player = jasmine.createSpyObj("player", {shouldUpdateAtTime: true, update:()=>{}, getEatenDots: ()=>{return 1;},
            getPosX: 1, getPosY: 1});
        let game = new Game(map, [ ghost1, ghost2 ], player, endGameCallback, pointsDisplay);

        game.update();

        expect(ghost1.shouldUpdateAtTime).toHaveBeenCalled();
        expect(ghost1.update).toHaveBeenCalled();
        expect(ghost2.shouldUpdateAtTime).toHaveBeenCalled();
        expect(ghost2.update).toHaveBeenCalled();
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
        let game = new Game(map,[ ghost ], player, endGameCallback, pointsDisplay);

        game.update();

        expect(endGameCallback).toHaveBeenCalled();
    });

    it("should update point display with eaten dots after player movement", ()=>{
        let map = { countDots: () => { return 2; }};        
        let player = jasmine.createSpyObj("player", {shouldUpdateAtTime: true, update:()=>{}, 
            getEatenDots: 1, getPosX: 1, getPosY: 1 }
        );
        let pointsDisplay = jasmine.createSpyObj('pointsDisplay', ['update']);
        let game = new Game(map,[], player, endGameCallback, pointsDisplay);

        game.update();

        expect(pointsDisplay.update).toHaveBeenCalledWith(1);
    });

    it("should decrease player lives and show message if ghost catches player", ()=>{
        let map = { countDots: () => { return 1; }};        
        let ghost = jasmine.createSpyObj("ghost", {shouldUpdateAtTime: true, update:()=>{},
                        getPosX: 0, getPosY: 0});

        let initialLives = 2;                    
        let player = new Player(map, {}, 0, 0, 0, initialLives);      
        let playerLivesLeftDisplay = jasmine.createSpyObj('playerLivesLeftDisplay', ['update']);
        let lostLifeDisplay = jasmine.createSpyObj('lostLifeDisplay', ['showMessage']);
        let game = new Game(map, [ ghost ], player, endGameCallback, pointsDisplay, playerLivesLeftDisplay, ()=>{} , lostLifeDisplay);

        game.update();

        expect(player.getLivesLeft()).toBe(1);
        expect(lostLifeDisplay.showMessage).toHaveBeenCalledWith("YOU LOST ONE LIFE!");
        expect(playerLivesLeftDisplay.update).toHaveBeenCalledWith(1);
    });

    it("should end game if no player lives left", ()=>{
        let map = { countDots: () => { return 1; }};        
        let ghost = jasmine.createSpyObj("ghost", {shouldUpdateAtTime: true, update:()=>{},
                        getPosX: 0, getPosY: 0});

        let initialLivesLeft = 0;                    
        let player = new Player(map, {}, 0, 0, 0, initialLivesLeft);      
        let playerLivesLeftDisplay = jasmine.createSpyObj('playerLivesLeftDisplay', ['update']);
        let gameOverCallback = jasmine.createSpy("gameOverCallback");
        let lostLifeDisplay = jasmine.createSpyObj('lostLifeDisplay', ['showMessage']);
        let game = new Game(map, [ ghost ], player, endGameCallback, pointsDisplay, playerLivesLeftDisplay, gameOverCallback, lostLifeDisplay);

        game.update();

        expect(lostLifeDisplay.showMessage).not.toHaveBeenCalled();
        expect(gameOverCallback).toHaveBeenCalled();
    });



});