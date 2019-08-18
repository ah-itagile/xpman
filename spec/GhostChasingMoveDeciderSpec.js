import * as Constants from '../src/model/constants';
import GhostRandomMoveDecider from '../src/model/ghostPossibleMovesFinder';

describe("ChasingMovesFinder", function() {

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
        { // move also to fields with dots
            currentDirection: Constants.DIRECTION_UP,
            map:[ [Constants.MAP_WALL,Constants.MAP_DOT,Constants.MAP_WALL],
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
        xit("should find move which heads to the player position", function() {
        
        // let map = {
        //     getTileAt: function(x,y) {
        //         let map = parameter.map;
        //         return map[y][x];
        //     }
        // };
        // let ghostPossibleMovesFinder = new GhostPossibleMovesFinder();
        
        // let possibleOptions = ghostPossibleMovesFinder.findPossibleMoves(map, 1, 1, parameter.currentDirection);
        // expect(possibleOptions).toEqual(parameter.expected);
    })});

});