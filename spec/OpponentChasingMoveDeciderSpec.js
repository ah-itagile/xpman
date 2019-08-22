import * as Constants from '../src/model/constants';
import ChasingMoveDecider from '../src/model/chasingMoveDecider';

describe("ChasingMoveDecider", function () {

    const parameters = [
        {
            opponentX: 0,
            opponentY: 0,
            playerX: 1,
            playerY: 0,
            options: [Constants.DIRECTION_RIGHT, Constants.DIRECTION_DOWN, Constants.DIRECTION_LEFT, Constants.DIRECTION_UP],
            expectedMove: Constants.DIRECTION_RIGHT
        },
        {
            opponentX: 1,
            opponentY: 0,
            playerX: 0,
            playerY: 0,
            options: [Constants.DIRECTION_RIGHT, Constants.DIRECTION_DOWN, Constants.DIRECTION_LEFT, Constants.DIRECTION_UP],
            expectedMove: Constants.DIRECTION_LEFT
        },
        {
            opponentX: 0,
            opponentY: 1,
            playerX: 0,
            playerY: 0,
            options: [Constants.DIRECTION_RIGHT, Constants.DIRECTION_DOWN, Constants.DIRECTION_LEFT, Constants.DIRECTION_UP],
            expectedMove: Constants.DIRECTION_UP
        },
        {
            opponentX: 0,
            opponentY: 0,
            playerX: 0,
            playerY: 1,
            options: [Constants.DIRECTION_RIGHT, Constants.DIRECTION_DOWN, Constants.DIRECTION_LEFT, Constants.DIRECTION_UP],
            expectedMove: Constants.DIRECTION_DOWN
        },
        {
            opponentX: 0,
            opponentY: 0,
            playerX: 1,
            playerY: 1,
            options: [Constants.DIRECTION_DOWN, Constants.DIRECTION_UP],
            expectedMove: Constants.DIRECTION_DOWN
        },
        {
            opponentX: 1,
            opponentY: 1,
            playerX: 0,
            playerY: 0,
            options: [Constants.DIRECTION_DOWN, Constants.DIRECTION_UP],
            expectedMove: Constants.DIRECTION_UP
        },
        // more than one possible move:
        {
            opponentX: 1,
            opponentY: 1,
            playerX: 0,
            playerY: 0,
            options: [Constants.DIRECTION_RIGHT, Constants.DIRECTION_DOWN, Constants.DIRECTION_LEFT, Constants.DIRECTION_UP],
            expectedMovesForFallbackMoveDecider: [Constants.DIRECTION_LEFT, Constants.DIRECTION_UP]
        },
        {
            opponentX: 0,
            opponentY: 0,
            playerX: 1,
            playerY: 1,
            options: [Constants.DIRECTION_RIGHT, Constants.DIRECTION_DOWN, Constants.DIRECTION_LEFT, Constants.DIRECTION_UP],
            expectedMovesForFallbackMoveDecider: [Constants.DIRECTION_RIGHT, Constants.DIRECTION_DOWN]
        },
        {
            opponentX: 1,
            opponentY: 0,
            playerX: 0,
            playerY: 1,
            options: [Constants.DIRECTION_RIGHT, Constants.DIRECTION_DOWN, Constants.DIRECTION_LEFT, Constants.DIRECTION_UP],
            expectedMovesForFallbackMoveDecider: [Constants.DIRECTION_LEFT, Constants.DIRECTION_DOWN]        
        },
        {
            opponentX: 0,
            opponentY: 1,
            playerX: 1,
            playerY: 0,
            options: [Constants.DIRECTION_RIGHT, Constants.DIRECTION_DOWN, Constants.DIRECTION_LEFT, Constants.DIRECTION_UP],
            expectedMovesForFallbackMoveDecider: [Constants.DIRECTION_UP, Constants.DIRECTION_RIGHT]
        },

    ];
    parameters.forEach((parameter) => {
        it("should find move which heads to the player position", function () {
            let fallbackMoveDecider = jasmine.createSpyObj("fallbackMoveDecider", ["chooseMove"]);
            let chasingMoveDecider = new ChasingMoveDecider(fallbackMoveDecider);
            let opponent = jasmine.createSpyObj("opponent", {getPosX: parameter.opponentX, getPosY: parameter.opponentY});
            let player = jasmine.createSpyObj("player", {getPosX: parameter.playerX, getPosY: parameter.playerY});
            let move = chasingMoveDecider.chooseMove(parameter.options, opponent, player);
            if (parameter.expectedMove) {
                expect(move).toBe(parameter.expectedMove);
            } else {
                expectAllPossibleDirectionsArePassedToFallback(fallbackMoveDecider, parameter);
            }
            
        })
    });

    it("should use fallback move decider if no chasing direction can be used", ()=>{
        let fallbackMoveDecider = jasmine.createSpyObj("fallbackMoveDecider", {chooseMove: Constants.DIRECTION_RIGHT});
        let chasingMoveDecider = new ChasingMoveDecider(fallbackMoveDecider);
        let opponent = jasmine.createSpyObj("opponent", {getPosX: 1, getPosY: 1});
        let player = jasmine.createSpyObj("player", {getPosX: 0, getPosY: 0});
        let options = [Constants.DIRECTION_RIGHT, Constants.DIRECTION_DOWN];
        let move = chasingMoveDecider.chooseMove(options, opponent, player);

        expect(fallbackMoveDecider.chooseMove).toHaveBeenCalled;
        expect(move).toBe(Constants.DIRECTION_RIGHT);
    });

});

function expectAllPossibleDirectionsArePassedToFallback(fallbackMoveDecider, parameter) {
    expect(fallbackMoveDecider.chooseMove.calls.count()).toBe(1);
    let chooseMoveArgs = fallbackMoveDecider.chooseMove.calls.argsFor(0)[0];
    expect(chooseMoveArgs.length).toBe(parameter.expectedMovesForFallbackMoveDecider.length);
    chooseMoveArgs.forEach(direction => {
        expect(parameter.expectedMovesForFallbackMoveDecider.includes(direction)).toBeTruthy();
    });
}
