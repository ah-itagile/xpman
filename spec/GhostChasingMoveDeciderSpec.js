import * as Constants from '../src/model/constants';
import GhostRandomMoveDecider from '../src/model/ghostPossibleMovesFinder';
import ChasingMoveDecider from '../src/model/chasingMoveDecider';

describe("ChasingMoveDecider", function () {

    const parameters = [
        {
            ghostX: 0,
            ghostY: 0,
            playerX: 1,
            playerY: 0,
            options: [Constants.DIRECTION_RIGHT, Constants.DIRECTION_DOWN, Constants.DIRECTION_LEFT, Constants.DIRECTION_UP],
            expectedMove: Constants.DIRECTION_RIGHT
        },
        {
            ghostX: 1,
            ghostY: 0,
            playerX: 0,
            playerY: 0,
            options: [Constants.DIRECTION_RIGHT, Constants.DIRECTION_DOWN, Constants.DIRECTION_LEFT, Constants.DIRECTION_UP],
            expectedMove: Constants.DIRECTION_LEFT
        },
        {
            ghostX: 0,
            ghostY: 1,
            playerX: 0,
            playerY: 0,
            options: [Constants.DIRECTION_RIGHT, Constants.DIRECTION_DOWN, Constants.DIRECTION_LEFT, Constants.DIRECTION_UP],
            expectedMove: Constants.DIRECTION_UP
        },
        {
            ghostX: 0,
            ghostY: 0,
            playerX: 0,
            playerY: 1,
            options: [Constants.DIRECTION_RIGHT, Constants.DIRECTION_DOWN, Constants.DIRECTION_LEFT, Constants.DIRECTION_UP],
            expectedMove: Constants.DIRECTION_DOWN
        },
        {
            ghostX: 0,
            ghostY: 0,
            playerX: 1,
            playerY: 1,
            options: [Constants.DIRECTION_DOWN, Constants.DIRECTION_UP],
            expectedMove: Constants.DIRECTION_DOWN
        },
        {
            ghostX: 1,
            ghostY: 1,
            playerX: 0,
            playerY: 0,
            options: [Constants.DIRECTION_DOWN, Constants.DIRECTION_UP],
            expectedMove: Constants.DIRECTION_UP
        },
    ];
    parameters.forEach((parameter) => {
        it("should find move which heads to the player position", function () {
            let chasingMoveDecider = new ChasingMoveDecider();
            let ghost = jasmine.createSpyObj("ghost", {getPosX: parameter.ghostX, getPosY: parameter.ghostY});
            let player = jasmine.createSpyObj("player", {getPosX: parameter.playerX, getPosY: parameter.playerY});
            let options = [Constants.DIRECTION_RIGHT, Constants.DIRECTION_DOWN, Constants.DIRECTION_LEFT, Constants.DIRECTION_UP];
            let move = chasingMoveDecider.chooseMove(parameter.options, ghost, player);

            expect(move).toBe(parameter.expectedMove);
        })
    });

    it("should use fallback move decider if no chasing direction can be used", ()=>{
        let fallbackMoveDecider = jasmine.createSpyObj("randomMoveDecider", {chooseMove: Constants.DIRECTION_RIGHT});
        let chasingMoveDecider = new ChasingMoveDecider(fallbackMoveDecider);
        let ghost = jasmine.createSpyObj("ghost", {getPosX: 1, getPosY: 1});
        let player = jasmine.createSpyObj("player", {getPosX: 0, getPosY: 0});
        let options = [Constants.DIRECTION_RIGHT, Constants.DIRECTION_DOWN];
        let move = chasingMoveDecider.chooseMove(options, ghost, player);

        expect(fallbackMoveDecider.chooseMove).toHaveBeenCalled;
        expect(move).toBe(Constants.DIRECTION_RIGHT);
    });

});