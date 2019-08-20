import PairProgrammingTimedAction from "../src/model/PairProgrammingTimedAction";
import * as Constants from "../src/model/constants";
import Player from "../src/model/player";

describe("Pair Programming Timed Action", ()=>{

    let pairingDisplay;

    beforeEach(()=>{
        pairingDisplay = jasmine.createSpyObj("pairing display", ["update", "showNothing"]);
    });

    it("should show display when player is pair programming", ()=>{
        let player = jasmine.createSpyObj("player", {getPairProgramming: true, getLeftPairProgrammingTime: 222});
        
        let action = new PairProgrammingTimedAction(0, 0, player, 111, pairingDisplay);
        
        action.update(777);
        expect(pairingDisplay.update).toHaveBeenCalledWith(222);
    });

    it("should show nothing when player is not pair programming", ()=>{
        let player = jasmine.createSpyObj("player", {getPairProgramming: false, getLeftPairProgrammingTime: 0});
        
        let action = new PairProgrammingTimedAction(0, 0, player, 111, pairingDisplay);
        
        action.update(777);
        expect(pairingDisplay.showNothing).toHaveBeenCalled();
    });


});