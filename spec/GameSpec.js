import XPacmanGame from '../src/model/xpacmanGame';
import Player from '../src/model/player';
import Ghost from '../src/model/ghost';

describe("XPacmanGame", () => {

    let pointsDisplay;
    let endGameCallback;
    let levelFinishedCallback;
    let gameOverCallback;
    let game;
    let map;
    let playerLivesLeftDisplay;
    let player;
    let ghosts;
    let lifeLostDisplay;

    beforeEach(() => {
        pointsDisplay = { update: () => { } };
        game = new XPacmanGame();
        levelFinishedCallback = jasmine.createSpy("levelFinishedCallback");
        game.setLevelFinishedCallback(levelFinishedCallback);
        map = { countDots: () => { return 1; } };
        game.setMapAdaptor(map);
        endGameCallback = jasmine.createSpy("endGameCallback");
        game.setEndGameCallback(endGameCallback);
        pointsDisplay = jasmine.createSpyObj("pointsDisplay", ["update"]);
        game.setPointsDisplay(pointsDisplay);
        playerLivesLeftDisplay = jasmine.createSpyObj("playerLivesLeftDisplay", ["update"]);
        game.setPlayerLivesLeftDisplay(playerLivesLeftDisplay);
        player = new Player(map, {}, 0, 0, 0, 2);
        game.setPlayer(player);
        ghosts = [new Ghost(map, 0, 0)];
        game.setGhosts(ghosts);
        lifeLostDisplay = jasmine.createSpyObj('lifeLostDisplay', ['showMessage']);
        game.setLifeLostDisplay(lifeLostDisplay);
        gameOverCallback = jasmine.createSpy("gameOverCallback");
        game.setGameOverCallback(gameOverCallback);
        let levels = [{
            ghosts: [{ posX: 2, posY: 2 }
            ],
            player: { posX: 3, posY: 3 }
        }];
        game.setLevelConfigs(levels);
    });

    it("should initialize on creation", () => {
        let levels = [{
            ghosts: [{ posX: 2, posY: 2 }
            ],
            player: { posX: 3, posY: 3 }
        }];

        game.setLevelConfigs(levels);

        game.initializeLevel();

        expect(pointsDisplay.update).toHaveBeenCalled();
        expect(playerLivesLeftDisplay.update).toHaveBeenCalledWith(2);
        expect(player.getPosX()).toBe(levels[0].player.posX);
        expect(player.getPosY()).toBe(levels[0].player.posY);
        expect(ghosts[0].getPosX()).toBe(levels[0].ghosts[0].posX);
        expect(ghosts[0].getPosY()).toBe(levels[0].ghosts[0].posY);
    });

    it("should update all ghosts and player during update loop", () => {
        let ghost1 = jasmine.createSpyObj("ghost1", {
            shouldUpdateAtTime: true, update: () => { },
            getPosX: 0, getPosY: 0
        });
        let ghost2 = jasmine.createSpyObj("ghost2", {
            shouldUpdateAtTime: true, update: () => { },
            getPosX: 0, getPosY: 0
        });
        let player = jasmine.createSpyObj("player", {
            shouldUpdateAtTime: true, update: () => { }, getEatenDots: () => { return 1; },
            getPosX: 1, getPosY: 1,
            setDotEatenEventListener: ()=>{}
        });
        game.setPlayer(player);
        game.setGhosts([ghost1, ghost2]);

        game.update();

        expect(ghost1.shouldUpdateAtTime).toHaveBeenCalled();
        expect(ghost1.update).toHaveBeenCalled();
        expect(ghost2.shouldUpdateAtTime).toHaveBeenCalled();
        expect(ghost2.update).toHaveBeenCalled();
        expect(player.shouldUpdateAtTime).toHaveBeenCalled();
        expect(player.update).toHaveBeenCalled();
    });

    it("should fire level finished event if player ate all dots", () => {
        let levels = [{
            ghosts: [{ posX: 2, posY: 2 }
            ],
            player: { posX: 3, posY: 3 }
        }, {
            ghosts: [{ posX: 2, posY: 2 }
            ],
            player: { posX: 3, posY: 3 }
        }];
        game.setLevelConfigs(levels);
        let player = jasmine.createSpyObj("player", 
            {
                shouldUpdateAtTime: true, update: () => { },
                getEatenDots: 1, 
                getPosX: 1, 
                getPosY: 1,
                setDotEatenEventListener: ()=>{},
                setPosX: ()=>{},
                setPosY: ()=>{}
            }
        );
        game.setPlayer(player);        

        game.initializeLevel();
        game.update();

        expect(levelFinishedCallback).toHaveBeenCalled();
    });

    it("should update point display after player movement", () => {
        let player = jasmine.createSpyObj("player", {
            shouldUpdateAtTime: true, update: () => { },
            getEatenDots: 0, getPosX: 1, getPosY: 1,
            setDotEatenEventListener: ()=>{}
        }
        );
        game.setPlayer(player);
        game.setGhosts([]);

        game.update();

        expect(pointsDisplay.update).toHaveBeenCalledWith(0);
    });

    it("should decrease player lives and show message if ghost catches player", () => {
        let map = { countDots: () => { return 1; } };
        let ghost = jasmine.createSpyObj("ghost", {
            shouldUpdateAtTime: true, update: () => { },
            getPosX: 0, getPosY: 0
        });

        let player = new Player(map, {}, 0, 0, 0);
        game.setPlayer(player);
        game.setGhosts([ghost]);

        game.update();

        expect(lifeLostDisplay.showMessage).toHaveBeenCalledWith("YOU LOST ONE LIFE!");
        expect(playerLivesLeftDisplay.update).toHaveBeenCalledWith(1);
    });

    it("should reset player and ghost positions when game continues after a life was lost", () => {
        let map = { countDots: () => { return 1; } };
        let ghost = new Ghost(map, 0, 0);

        let player = new Player(map, {}, 0, 0, 0);

        let levels = [{
            ghosts: [{ posX: 2, posY: 2 }
            ],
            player: { posX: 3, posY: 3 }
        }];
        game.setLevelConfigs(levels);
        game.setPlayer(player);
        game.setGhosts([ghost]);

        game.continueAfterLifeLost();

        expect(ghost.getPosX()).toBe(levels[0].ghosts[0].posX);
        expect(ghost.getPosY()).toBe(levels[0].ghosts[0].posY);
        expect(player.getPosX()).toBe(levels[0].player.posX);
        expect(player.getPosY()).toBe(levels[0].player.posY);
    });

    it("should end game if no player lives left", () => {
        let map = { countDots: () => { return 1; } };
        let ghost = jasmine.createSpyObj("ghost", {
            shouldUpdateAtTime: true, update: () => { },
            getPosX: 0, getPosY: 0
        });

        let player = new Player(map, {}, 0, 0, 0);
        game.setPlayer(player);
        game.setGhosts([ghost]);

        game.update();
        game.update();
        game.update();

        expect(lifeLostDisplay.showMessage).toHaveBeenCalledTimes(2);
        expect(gameOverCallback).toHaveBeenCalled();
    });

    it("should increase current level if level was finished", ()=>{
        let levels = [{
            ghosts: [{ posX: 2, posY: 2 }
            ],
            player: { posX: 3, posY: 3 }
        }, {
            ghosts: [{ posX: 2, posY: 2 }
            ],
            player: { posX: 3, posY: 3 }
        }];
        game.setLevelConfigs(levels);
        game.initializeLevel();
        expect(game.getCurrentLevel()).toBe(1);

        let player = jasmine.createSpyObj("player", 
            {
                shouldUpdateAtTime: true, update: () => { },
                getEatenDots: 1, getPosX: 1, getPosY: 1,
                setDotEatenEventListener: ()=>{}
            }
        );
        game.setPlayer(player);        

        game.update();

        expect(game.getCurrentLevel()).toBe(2);
    });

    it("should finish game if level was finished and no more levels left", ()=>{
        game.initializeLevel();
        expect(game.getCurrentLevel()).toBe(1);

        let player = jasmine.createSpyObj("player", 
            {
                shouldUpdateAtTime: true, update: () => { },
                getEatenDots: 1, getPosX: 1, getPosY: 1,
                setDotEatenEventListener: ()=>{}
            }
        );
        game.setPlayer(player);        

        game.update();

        expect(endGameCallback).toHaveBeenCalled();
    });

});