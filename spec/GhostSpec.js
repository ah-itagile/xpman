import Ghost from '../src/model/ghost';

describe("Ghost", function() {
    //var Ghost = require('../src/model/ghost');

    it("should be initialized", function() {
        let ghost = new Ghost();
        console.log("ghost=" + JSON.stringify(ghost));
        expect(ghost.getPosX()).toBe(0);
    });
});