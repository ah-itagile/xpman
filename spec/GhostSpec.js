import Ghost from '../src/model/ghost';
import * as Constants from '../src/model/constants';
import GhostPossibleMovesFinder from '../src/model/ghostPossibleMovesFinder';

describe("Ghost", function() {

    it("should be initialized", function() {
        let ghost = new Ghost();
        expect(ghost.getPosX()).toBe(0);
        expect(ghost.getPosY()).toBe(0);
    });


    [{direction: Constants.DIRECTION_LEFT, expectedX: 0, expectedY: 1},
        {direction: Constants.DIRECTION_RIGHT, expectedX: 2, expectedY: 1},
        {direction: Constants.DIRECTION_UP, expectedX: 1, expectedY: 0},
        {direction: Constants.DIRECTION_DOWN, expectedX: 1, expectedY: 2}
    ].forEach((parameters) => it("should update position according to the chosen direction", () => {
        let moveDecider = jasmine.createSpyObj("moveDecider", { chooseMove:  parameters.direction});
        let possibleMovesFinder = jasmine.createSpyObj("possibleMovesFinder", {findPossibleMoves:[]});
        let ghost = new Ghost({}, 0, 0, moveDecider, possibleMovesFinder);
        ghost.setPosX(1);
        ghost.setPosY(1);

        ghost.update(0);

        expect(ghost.getPosX()).toBe(parameters.expectedX);
        expect(ghost.getPosY()).toBe(parameters.expectedY);
    }));

    it("should update after waiting long enough", ()=>{
        let waitTimeInMs = 500;
        let lastUpdatedAtTimeInMs = 0;
        let ghost = new Ghost({}, waitTimeInMs, lastUpdatedAtTimeInMs);

        expect(ghost.shouldUpdateAtTime(0)).toBeFalsy();
        expect(ghost.shouldUpdateAtTime(500)).toBeFalsy();
        expect(ghost.shouldUpdateAtTime(501)).toBeTruthy();
    });
});