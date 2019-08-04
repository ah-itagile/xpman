import Ghost from '../src/model/ghost';
import * as Constants from '../src/model/constants';

describe("Ghost", function() {

    it("should be initialized", function() {
        let ghost = new Ghost();
        expect(ghost.getPosX()).toBe(0);
    });

    const parameters = [ 
        {
            currentDirection: Constants.DIRECTION_RIGHT,
            map:[ [Constants.MAP_WALL,Constants.MAP_WALL,Constants.MAP_WALL],
                [Constants.MAP_WALL,Constants.MAP_FREE,Constants.MAP_FREE],
                [Constants.MAP_WALL,Constants.MAP_WALL,Constants.MAP_WALL],
                ],
            expected: [Constants.DIRECTION_RIGHT]
        },        
        {
            currentDirection: Constants.DIRECTION_DOWN,
            map:[ [Constants.MAP_WALL,Constants.MAP_WALL,Constants.MAP_WALL],
                [Constants.MAP_WALL,Constants.MAP_FREE,Constants.MAP_WALL],
                [Constants.MAP_WALL,Constants.MAP_FREE,Constants.MAP_WALL],
                ],
            expected: [Constants.DIRECTION_DOWN]
        },        
        {
            currentDirection: Constants.DIRECTION_LEFT,
            map:[ [Constants.MAP_WALL,Constants.MAP_WALL,Constants.MAP_WALL],
                [Constants.MAP_FREE,Constants.MAP_FREE,Constants.MAP_WALL],
                [Constants.MAP_WALL,Constants.MAP_WALL,Constants.MAP_WALL],
                ],
            expected: [Constants.DIRECTION_LEFT]
        },        
        {
            currentDirection: Constants.DIRECTION_UP,
            map:[ [Constants.MAP_WALL,Constants.MAP_FREE,Constants.MAP_WALL],
                [Constants.MAP_WALL,Constants.MAP_FREE,Constants.MAP_WALL],
                [Constants.MAP_WALL,Constants.MAP_WALL,Constants.MAP_WALL],
                ],
            expected: [Constants.DIRECTION_UP]
        },              
        {  // filter only the opposing direction
            currentDirection: Constants.DIRECTION_UP,
            map:[ [Constants.MAP_WALL,Constants.MAP_FREE,Constants.MAP_WALL],
                [Constants.MAP_FREE,Constants.MAP_FREE,Constants.MAP_FREE],
                [Constants.MAP_WALL,Constants.MAP_FREE,Constants.MAP_WALL],
                ],
            expected: [Constants.DIRECTION_RIGHT, Constants.DIRECTION_LEFT, Constants.DIRECTION_UP]
        }          
    ];
    parameters.forEach((parameter) => {
        it("should find possible options for movement", function() {
        
        let map = {
            getTileAt: function(x,y) {
                let map = parameter.map;
                return map[y][x];
            }
        };
        let ghost = new Ghost();
        ghost.setPosX(1);
        ghost.setPosY(1);
        ghost.setDirection(parameter.currentDirection);
        
        let possibleOptions = ghost.findPossibleMoves(map);
        expect(possibleOptions).toEqual(parameter.expected);
    })});


    const directionParams = [{direction: Constants.DIRECTION_LEFT, expectedX: 0, expectedY: 1},
        {direction: Constants.DIRECTION_RIGHT, expectedX: 2, expectedY: 1},
        {direction: Constants.DIRECTION_UP, expectedX: 1, expectedY: 0},
        {direction: Constants.DIRECTION_DOWN, expectedX: 1, expectedY: 2}
    ];
    directionParams.forEach((parameters) => it("should change position according to the given direction", () => {
        let ghost = new Ghost();
        ghost.setPosX(1);
        ghost.setPosY(1);

        ghost.move(parameters.direction);

        expect(ghost.getPosX()).toBe(parameters.expectedX);
        expect(ghost.getPosY()).toBe(parameters.expectedY);
    }));
});