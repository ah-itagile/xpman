import XPacmanGame from '../src/model/xpacmanGame';
import Player from '../src/model/player';
import Ghost from '../src/model/ghost';

describe("XPacmanGame", () => {

    let pointsDisplay;
    let endGameCallback;

    beforeEach(() => {
        pointsDisplay = { update: () => { } };
        endGameCallback = () => { };
    });

    it("should initialize on creation", () => {
        let levels = [{
            ghosts: [{ posX: 2, posY: 2 }
            ],
            player: { posX: 3, posY: 3 }
        }];
        let map = { countDots: () => { return 1; } };
        let player = new Player(map, {}, 0, 0, 0, 2);
        let endGameCallback = jasmine.createSpy();
        let pointsDisplay = jasmine.createSpyObj("pointsDisplay", ["update"]);
        let playerLivesLeftDisplay = jasmine.createSpyObj("playerLivesLeftDisplay", ["update"]);
        let ghost = new Ghost(map, 0, 0);
        let game = new XPacmanGame(levels);
        game.setPlayer(player);
        game.setGhosts([ghost]);
        game.setMapAdaptor(map);
        game.setEndGameCallback(endGameCallback);
        game.setPlayerLivesLeftDisplay(playerLivesLeftDisplay);
        game.setPointsDisplay(pointsDisplay);

        game.initialize();

        expect(pointsDisplay.update).toHaveBeenCalled();
        expect(playerLivesLeftDisplay.update).toHaveBeenCalledWith(2);
        expect(player.getPosX()).toBe(levels[0].player.posX);
        expect(player.getPosY()).toBe(levels[0].player.posY);
        expect(ghost.getPosX()).toBe(levels[0].ghosts[0].posX);
        expect(ghost.getPosY()).toBe(levels[0].ghosts[0].posY);
    });

    it("should update all ghosts and player during update loop", () => {
        let map = { countDots: () => { return 1; } };
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
            getPosX: 1, getPosY: 1
        });
        let game = new XPacmanGame(map);
        game.setPointsDisplay(pointsDisplay);
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

    it("should fire end game event if player ate all dots", () => {
        let map = { countDots: () => { return 1; } };
        let ghost = jasmine.createSpyObj("ghost", {
            shouldUpdateAtTime: true, update: () => { },
            getPosX: 0, getPosY: 0
        });
        let player = jasmine.createSpyObj("player", {
            shouldUpdateAtTime: true, update: () => { },
            getEatenDots: 1, getPosX: 1, getPosY: 1
        }
        );
        let endGameCallback = jasmine.createSpy("endGameCallback");
        let game = new XPacmanGame(map);
        game.setPlayer(player);
        game.setGhosts([ghost]);
        game.setMapAdaptor(map);
        game.setPointsDisplay(pointsDisplay);
        game.setEndGameCallback(endGameCallback);

        game.resetLevel();
        game.update();

        expect(endGameCallback).toHaveBeenCalled();
    });

    it("should update point display with eaten dots after player movement", () => {
        let map = { countDots: () => { return 2; } };
        let player = jasmine.createSpyObj("player", {
            shouldUpdateAtTime: true, update: () => { },
            getEatenDots: 1, getPosX: 1, getPosY: 1
        }
        );
        let pointsDisplay = jasmine.createSpyObj('pointsDisplay', ['update']);
        let game = new XPacmanGame(map, [],endGameCallback);
        game.setPlayer(player);
        game.setGhosts([]);
        game.setPointsDisplay(pointsDisplay);

        game.update();

        expect(pointsDisplay.update).toHaveBeenCalledWith(1);
    });

    it("should decrease player lives and show message if ghost catches player", () => {
        let map = { countDots: () => { return 1; } };
        let ghost = jasmine.createSpyObj("ghost", {
            shouldUpdateAtTime: true, update: () => { },
            getPosX: 0, getPosY: 0
        });

        let initialLives = 2;
        let player = new Player(map, {}, 0, 0, 0, initialLives);
        let playerLivesLeftDisplay = jasmine.createSpyObj('playerLivesLeftDisplay', ['update']);
        let lostLifeDisplay = jasmine.createSpyObj('lostLifeDisplay', ['showMessage']);
        let game = new XPacmanGame(map, [ghost]);
        game.setPlayer(player);
        game.setGhosts([ghost]);
        game.setPlayerLivesLeftDisplay(playerLivesLeftDisplay);
        game.setLifeLostDisplay(lostLifeDisplay);

        game.update();

        expect(player.getLivesLeft()).toBe(1);
        expect(lostLifeDisplay.showMessage).toHaveBeenCalledWith("YOU LOST ONE LIFE!");
        expect(playerLivesLeftDisplay.update).toHaveBeenCalledWith(1);
    });

    it("should reset player and ghost positions when game continues after a life was lost", () => {
        let map = { countDots: () => { return 1; } };
        let ghost = new Ghost(map, 0, 0);

        let initialLives = 2;
        let player = new Player(map, {}, 0, 0, 0, initialLives);
        let playerLivesLeftDisplay = jasmine.createSpyObj('playerLivesLeftDisplay', ['update']);
        let lostLifeDisplay = jasmine.createSpyObj('lostLifeDisplay', ['showMessage']);

        let levels = [{
            ghosts: [{ posX: 2, posY: 2 }
            ],
            player: { posX: 3, posY: 3 }
        }];
        let game = new XPacmanGame(levels);
        game.setPlayer(player);
        game.setGhosts([ghost]);
        game.setMapAdaptor(map);
        game.setLifeLostDisplay(lostLifeDisplay);
        game.setPointsDisplay(pointsDisplay);
        game.setEndGameCallback(endGameCallback);
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

        let initialLivesLeft = 0;
        let player = new Player(map, {}, 0, 0, 0, initialLivesLeft);
        let playerLivesLeftDisplay = jasmine.createSpyObj('playerLivesLeftDisplay', ['update']);
        let gameOverCallback = jasmine.createSpy("gameOverCallback");
        let lostLifeDisplay = jasmine.createSpyObj('lostLifeDisplay', ['showMessage']);
        let game = new XPacmanGame(map);
        game.setPlayer(player);
        game.setGhosts([ghost]);
        game.setPlayerLivesLeftDisplay(playerLivesLeftDisplay);
        game.setGameOverCallback(gameOverCallback);
        game.update();

        expect(lostLifeDisplay.showMessage).not.toHaveBeenCalled();
        expect(gameOverCallback).toHaveBeenCalled();
    });



});