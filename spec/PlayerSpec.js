import Player from '../src/model/player'

describe("Player", () => {

    let parameters = [
        {pressedControl:'up', expectedPosX:1, expectedPosY:0},
        {pressedControl:'left', expectedPosX:0, expectedPosY:1},
        {pressedControl:'down', expectedPosX:1, expectedPosY:2},
        {pressedControl:'right', expectedPosX:2, expectedPosY:1}
    ];
    parameters.forEach((parameter)=> {
        it("should move according to input controls", () => {
            let map = {};
            let stubControls = { up: ()=> {return false;}, left: ()=> {return false;}, down: ()=>{return false;}, right: ()=>{return false;}};
            let player = new Player(map, stubControls);
            player.setPosX(1);
            player.setPosY(1);

            stubControls[parameter.pressedControl] = ()=>{return true;};
            player.update();

            expect(player.getPosX()).toBe(parameter.expectedPosX);
            expect(player.getPosY()).toBe(parameter.expectedPosY);
        });
    });

    it("should call update after waiting short time when no movement", ()=>{
        let waitTimeInMs = 1;
        let waitTimeAfterMovementInMs = 250;
        let lastUpdatedAtTimeInMs = 0;

        let map = {};
        let stubControls = { up: ()=> {return false;}, left: ()=> {return false;}, down: ()=>{return false;}, right: ()=>{return false;}};
        let player = new Player(map, stubControls, waitTimeInMs, waitTimeAfterMovementInMs, lastUpdatedAtTimeInMs);

        expect(player.shouldUpdateAtTime(0)).toBeFalsy();
        expect(player.shouldUpdateAtTime(1)).toBeTruthy();
        
        player.update(1);

        expect(player.shouldUpdateAtTime(1)).toBeFalsy();
        expect(player.shouldUpdateAtTime(2)).toBeTruthy();
    });

    [
        {pressedControl:'up'},
        {pressedControl:'left'},
        {pressedControl:'down'},
        {pressedControl:'right'}
    ].forEach((parameter)=> {
        it("should call update after waiting longer time after movement", ()=>{
            let waitTimeInMs = 1;
            let waitTimeAfterMovementInMs = 250;
            let lastUpdatedAtTimeInMs = 0;

            let map = {};
            let stubControls = { up: ()=> {return false;}, left: ()=> {return false;}, down: ()=>{return false;}, right: ()=>{return false;}};
            stubControls[parameter.pressedControl] = ()=>{return true;};
            let player = new Player(map, stubControls, waitTimeInMs, waitTimeAfterMovementInMs, lastUpdatedAtTimeInMs);
            
            player.update(1);

            expect(player.shouldUpdateAtTime(1)).toBeFalsy();
            expect(player.shouldUpdateAtTime(2)).toBeFalsy();
            expect(player.shouldUpdateAtTime(251)).toBeTruthy();
        });
    });

    it("should reset wait interval to short when movement stopped", ()=>{
        let waitTimeInMs = 1;
        let waitTimeAfterMovementInMs = 250;
        let lastUpdatedAtTimeInMs = 0;

        let map = {};
        let stubControls = { up: ()=> {return true;}, left: ()=> {return false;}, down: ()=>{return false;}, right: ()=>{return false;}};
        let player = new Player(map, stubControls, waitTimeInMs, waitTimeAfterMovementInMs, lastUpdatedAtTimeInMs);
        
        player.update(1);

        stubControls.up = () => { return false;};    
        player.update(251);
        expect(player.shouldUpdateAtTime(252)).toBeTruthy();        
    });
});