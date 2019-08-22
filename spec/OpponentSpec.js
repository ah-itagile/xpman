import Opponent from '../src/model/opponent';
import * as Constants from '../src/model/constants';
import OpponentPossibleMovesFinder from '../src/model/opponentPossibleMovesFinder';

describe("Opponent", function() {

    it("should be initialized", function() {
        let opponent = new Opponent();
        expect(opponent.getPosX()).toBe(0);
        expect(opponent.getPosY()).toBe(0);
    });


    [{direction: Constants.DIRECTION_LEFT, expectedX: 0, expectedY: 1},
        {direction: Constants.DIRECTION_RIGHT, expectedX: 2, expectedY: 1},
        {direction: Constants.DIRECTION_UP, expectedX: 1, expectedY: 0},
        {direction: Constants.DIRECTION_DOWN, expectedX: 1, expectedY: 2}
    ].forEach((parameters) => it("should update position according to the chosen direction", () => {
        let moveDecider = jasmine.createSpyObj("moveDecider", { chooseMove:  parameters.direction});
        let possibleMovesFinder = jasmine.createSpyObj("possibleMovesFinder", {findPossibleMoves:[]});
        let opponent = new Opponent({}, 0, 0, moveDecider, possibleMovesFinder);
        opponent.setPosX(1);
        opponent.setPosY(1);

        opponent.update(0);

        expect(opponent.getPosX()).toBe(parameters.expectedX);
        expect(opponent.getPosY()).toBe(parameters.expectedY);
    }));

    it("should update after waiting long enough", ()=>{
        let waitTimeInMs = 500;
        let lastUpdatedAtTimeInMs = 0;
        let opponent = new Opponent({}, waitTimeInMs, lastUpdatedAtTimeInMs);

        expect(opponent.shouldUpdateAtTime(0)).toBeFalsy();
        expect(opponent.shouldUpdateAtTime(500)).toBeFalsy();
        expect(opponent.shouldUpdateAtTime(501)).toBeTruthy();
    });
});