import XPManGame from '../src/model/xpmanGame';
import Player from '../src/model/player';
import Opponent from '../src/model/opponent';
import * as Constants from '../src/model/constants'; 

describe("XPManGame", () => {

    let pointsDisplay;
    let endGameCallback;
    let levelFinishedCallback;
    let gameOverCallback;
    let game;
    let map;
    let playerLivesLeftDisplay;
    let player;
    let opponents;
    let lifeLostDisplay;

    beforeEach(() => {
        pointsDisplay = { update: () => { } };
        game = new XPManGame();
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
        opponents = [new Opponent(map, 0, 0)];
        game.setInitialOpponents(opponents);
        lifeLostDisplay = jasmine.createSpyObj('lifeLostDisplay', ['showMessage']);
        game.setLifeLostDisplay(lifeLostDisplay);
        gameOverCallback = jasmine.createSpy("gameOverCallback");
        game.setGameOverCallback(gameOverCallback);
        let levels = [{
            opponents: [{ posX: 2, posY: 2 }
            ],
            player: { posX: 3, posY: 3 }
        }];
        game.setLevelConfigs(levels);
    });

    it("should initialize on creation", () => {
        let levels = [{
            opponents: [{ posX: 2, posY: 2 }
            ],
            player: { posX: 3, posY: 3 }
        }];

        game.setLevelConfigs(levels);

        game.initializeLevel();

        expect(pointsDisplay.update).toHaveBeenCalled();
        expect(playerLivesLeftDisplay.update).toHaveBeenCalledWith(2);
        expect(player.getPosX()).toBe(levels[0].player.posX);
        expect(player.getPosY()).toBe(levels[0].player.posY);
        expect(opponents[0].getPosX()).toBe(levels[0].opponents[0].posX);
        expect(opponents[0].getPosY()).toBe(levels[0].opponents[0].posY);
    });

    it("should update all opponents and player during update loop", () => {
        let opponent1 = jasmine.createSpyObj("opponent1", {
            shouldUpdateAtTime: true, update: () => { },
            getPosX: 0, getPosY: 0
        });
        let opponent2 = jasmine.createSpyObj("opponent2", {
            shouldUpdateAtTime: true, update: () => { },
            getPosX: 0, getPosY: 0
        });
        let player = jasmine.createSpyObj("player", {
            shouldUpdateAtTime: true, update: () => { }, getEatenDots: () => { return 1; },
            getPosX: 1, getPosY: 1,
            setDotEatenEventListener: ()=>{}
        });
        game.setPlayer(player);
        game.setInitialOpponents([opponent1, opponent2]);

        game.update();

        expect(opponent1.shouldUpdateAtTime).toHaveBeenCalled();
        expect(opponent1.update).toHaveBeenCalled();
        expect(opponent2.shouldUpdateAtTime).toHaveBeenCalled();
        expect(opponent2.update).toHaveBeenCalled();
        expect(player.shouldUpdateAtTime).toHaveBeenCalled();
        expect(player.update).toHaveBeenCalled();
    });

    it("should update all timed actions during update loop", () => {
        let timedAction = jasmine.createSpyObj("timed action", {
            shouldUpdateAtTime: true, 
            update: () => { }
        });
        game.setTimedActions([timedAction]);
        game.update();

        expect(timedAction.shouldUpdateAtTime).toHaveBeenCalled();
        expect(timedAction.update).toHaveBeenCalled();

    });

    it("should fire level finished event if player ate all dots", () => {
        let levels = [{
            opponents: [{ posX: 2, posY: 2 }
            ],
            player: { posX: 3, posY: 3 }
        }, {
            opponents: [{ posX: 2, posY: 2 }
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
        game.setInitialOpponents([]);

        game.update();

        expect(pointsDisplay.update).toHaveBeenCalledWith(0);
    });

    it("should decrease player lives and show message if opponent catches player", () => {
        let map = { countDots: () => { return 1; } };
        let opponent = jasmine.createSpyObj("opponent", {
            shouldUpdateAtTime: true, update: () => { },
            getPosX: 0, getPosY: 0
        });

        let player = new Player(map, {}, 0, 0, 0);
        game.setPlayer(player);
        game.setInitialOpponents([opponent]);

        game.update();

        expect(lifeLostDisplay.showMessage).toHaveBeenCalledWith("YOU LOST ONE LIFE!");
        expect(playerLivesLeftDisplay.update).toHaveBeenCalledWith(1);
    });

    it("should decrease player lives and show message if player steps on opponent", () => {
        let opponent = jasmine.createSpyObj("opponent", {
            shouldUpdateAtTime: false, update: () => { },
            getPosX: 0, getPosY: 0
        });
        let player = jasmine.createSpyObj("player", {
            shouldUpdateAtTime: true, update: () => { }, getEatenDots: () => { return 1; },
            getPosX: 0 , getPosY: 0,
            getPairProgramming: false,
            setDotEatenEventListener: ()=>{}
        });

        game.setPlayer(player);
        game.setInitialOpponents([opponent]);

        game.update(0);

        expect(lifeLostDisplay.showMessage).toHaveBeenCalledWith("YOU LOST ONE LIFE!");
        expect(playerLivesLeftDisplay.update).toHaveBeenCalledWith(1);
    });

    it("should decrease player lives only once if player and opponents are moved in the same update loop call", () => {
        let opponent = jasmine.createSpyObj("opponent", {
            shouldUpdateAtTime: true, update: () => { },
            getPosX: 0, getPosY: 0
        });
        let player = jasmine.createSpyObj("player", {
            shouldUpdateAtTime: true, update: () => { }, getEatenDots: () => { return 1; },
            getPosX: 0 , getPosY: 0,
            getPairProgramming: false,
            setDotEatenEventListener: ()=>{}
        });

        game.setPlayer(player);
        game.setInitialOpponents([opponent]);

        game.update(0);

        expect(playerLivesLeftDisplay.update).toHaveBeenCalledTimes(1);
    });

    it("should remove killable opponent if player catches opponent while pair programming", () => {
        let map = { countDots: () => { return 1; } };
        let opponent = jasmine.createSpyObj("opponent", {
            shouldUpdateAtTime: true, update: () => { },
            getPosX: 0, 
            getPosY: 0,
            destroy: ()=>{},
            getKillableByPairProgramming: true
        });

        let player = new Player(map, {}, 0, 0, 0);
        player.setPairProgramming(true);
        game.setPlayer(player);
        game.setInitialOpponents([opponent]);

        game.update();

        expect(game.getOpponents().length).toBe(0);
        expect(opponent.destroy).toHaveBeenCalled();
        expect(lifeLostDisplay.showMessage).not.toHaveBeenCalled();        
    });

    it("should not remove non-killable opponent if player catches opponent while pair programming", () => {
        let map = { countDots: () => { return 1; } };
        let opponent = jasmine.createSpyObj("opponent", {
            shouldUpdateAtTime: true, update: () => { },
            getPosX: 0, 
            getPosY: 0,
            destroy: ()=>{},
            getKillableByPairProgramming: false
        });

        let player = new Player(map, {}, 0, 0, 0);
        player.setPairProgramming(true);
        game.setPlayer(player);
        game.setInitialOpponents([opponent]);

        game.update();

        expect(game.getOpponents().length).toBe(1);
        expect(opponent.destroy).not.toHaveBeenCalled();        
    });

    it("should reset timed actions if player lost life", () => {
        let timedAction = jasmine.createSpyObj("timed action", {
            shouldUpdateAtTime: true, 
            update: () => { },
            reset: ()=>{}
        });
        game.setTimedActions([timedAction]);

        game.continueAfterLifeLost();

        expect(timedAction.reset).toHaveBeenCalled();
    });

    it("should inform timed actions about player step", () => {
        let player = jasmine.createSpyObj("player", {
                shouldUpdateAtTime: true, update: () => { },
                getEatenDots: 0, getPosX: 1, getPosY: 1,
                setDotEatenEventListener: ()=>{}
            }
        );
        game.setPlayer(player);
        game.setInitialOpponents([]);
        let timedAction = jasmine.createSpyObj("timed action", {
            shouldUpdateAtTime: true, 
            update: () => { },
            reset: ()=>{},
            playerSteppedOn: ()=>{}
        });
        game.setTimedActions([timedAction]);
        let map = jasmine.createSpyObj("map", {getTileAt:Constants.MAP_CI_SERVER});
        game.setMapAdaptor(map);

        game.update();

        expect(timedAction.playerSteppedOn).toHaveBeenCalledWith(Constants.MAP_CI_SERVER);
    });

    it("should reset player and opponent positions when game continues after a life was lost", () => {
        let map = { countDots: () => { return 1; } };
        let opponent = new Opponent(map, 0, 0);

        let player = new Player(map, {}, 0, 0, 0);

        let levels = [{
            opponents: [{ posX: 2, posY: 2 }
            ],
            player: { posX: 3, posY: 3 }
        }];
        game.setLevelConfigs(levels);
        game.setPlayer(player);
        game.setInitialOpponents([opponent]);

        game.continueAfterLifeLost();

        expect(opponent.getPosX()).toBe(levels[0].opponents[0].posX);
        expect(opponent.getPosY()).toBe(levels[0].opponents[0].posY);
        expect(player.getPosX()).toBe(levels[0].player.posX);
        expect(player.getPosY()).toBe(levels[0].player.posY);
    });

    it("should remove spawned opponents after a life was lost", () => {
        let map = { countDots: () => { return 1; } };
        let opponent = new Opponent(map, 0, 0);

        let player = new Player(map, {}, 0, 0, 0);

        let levels = [{
            opponents: [{ posX: 2, posY: 2 }
            ],
            player: { posX: 3, posY: 3 }
        }];
        game.setLevelConfigs(levels);
        game.setPlayer(player);
        let initialOpponents = [opponent];
        game.setInitialOpponents(initialOpponents);
        let destroyListener = jasmine.createSpyObj("destroyListener", ["destroy"]);
        let spawnedOpponent = new Opponent(map, 0, 0, null, null);
        spawnedOpponent.setDestroyListener(destroyListener);
        game.addOpponent(spawnedOpponent);

        game.continueAfterLifeLost();

        expect(game.getOpponents().length).toBe(initialOpponents.length);
        expect(destroyListener.destroy).toHaveBeenCalled();
    });


    it("should end game if no player lives left", () => {
        let map = { countDots: () => { return 1; } };
        let opponent = jasmine.createSpyObj("opponent", {
            shouldUpdateAtTime: true, update: () => { },
            getPosX: 0, getPosY: 0
        });

        let player = new Player(map, {}, 0, 0, 0);
        game.setPlayer(player);
        game.setInitialOpponents([opponent]);

        game.update();
        game.update();
        game.update();

        expect(lifeLostDisplay.showMessage).toHaveBeenCalledTimes(2);
        expect(gameOverCallback).toHaveBeenCalled();
    });

    it("should increase current level if level was finished", ()=>{
        let levels = [{
            opponents: [{ posX: 2, posY: 2 }
            ],
            player: { posX: 3, posY: 3 }
        }, {
            opponents: [{ posX: 2, posY: 2 }
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