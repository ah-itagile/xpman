import Ghost from '../src/model/ghost';
import * as Constants from '../src/model/constants';

describe("Ghost", function() {
    //var Ghost = require('../src/model/ghost');

    it("should be initialized", function() {
        let ghost = new Ghost();
        console.log("ghost=" + JSON.stringify(ghost));
        expect(ghost.getPosX()).toBe(0);
    });

    const parameters = [ 
        {
            map:[ [Constants.MAP_WALL,Constants.MAP_WALL,Constants.MAP_WALL],
                [Constants.MAP_WALL,Constants.MAP_FREE,Constants.MAP_FREE],
                [Constants.MAP_WALL,Constants.MAP_WALL,Constants.MAP_WALL],
                ],
            expected: [Constants.DIRECTION_RIGHT]
        },        
        {
            map:[ [Constants.MAP_WALL,Constants.MAP_WALL,Constants.MAP_WALL],
                [Constants.MAP_WALL,Constants.MAP_FREE,Constants.MAP_WALL],
                [Constants.MAP_WALL,Constants.MAP_FREE,Constants.MAP_WALL],
                ],
            expected: [Constants.DIRECTION_DOWN]
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
        ghost.setDirection(Constants.DIRECTION_RIGHT);
        
        let possibleOptions = ghost.findPossibleMoves(map);
        console.log("expected:" + JSON.stringify(parameter.expected))
        console.log("possibleOptions:" + JSON.stringify(possibleOptions))
        expect(possibleOptions).toEqual(parameter.expected);
    })});
});