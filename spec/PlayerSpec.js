import Player from '../src/model/player';
import * as Constants from '../src/model/constants';

describe("Player", () => {

    let parameters = [
        {pressedControl:'up', expectedPosX:1, expectedPosY:0, tiles:Constants.MAP_FREE},
        {pressedControl:'left', expectedPosX:0, expectedPosY:1, tiles:Constants.MAP_FREE},
        {pressedControl:'down', expectedPosX:1, expectedPosY:2, tiles:Constants.MAP_FREE},
        {pressedControl:'right', expectedPosX:2, expectedPosY:1, tiles:Constants.MAP_FREE},

        {pressedControl:'up', expectedPosX:1, expectedPosY:1, tiles:Constants.MAP_WALL},
        {pressedControl:'left', expectedPosX:1, expectedPosY:1, tiles:Constants.MAP_WALL},
        {pressedControl:'down', expectedPosX:1, expectedPosY:1, tiles:Constants.MAP_WALL},
        {pressedControl:'right', expectedPosX:1, expectedPosY:1, tiles:Constants.MAP_WALL},

        {pressedControl:'right', expectedPosX:2, expectedPosY:1, tiles:Constants.MAP_CI_SERVER},
        {pressedControl:'right', expectedPosX:2, expectedPosY:1, tiles:Constants.MAP_PAIRPROG}
    ];
    parameters.forEach((parameter)=> {
        it("should move according to input controls", () => {
            let map = { getTileAt: () => { return parameter.tiles;}, replaceTile: ()=>{}};
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

    [
        {pressedControl:'up', expectedPosX:1, expectedPosY:0, tiles:Constants.MAP_FREE, expectTileToBeReplaced: false, expectedEatenDots: 0, expectDotEatenEventFiredTimes:0 },
        {pressedControl:'up', expectedPosX:1, expectedPosY:0, tiles:Constants.MAP_DOT, expectTileToBeReplaced: true, expectedEatenDots: 1, expectDotEatenEventFiredTimes:1},
    ].forEach((parameter)=> {
        it("should eat dot if dot on field", () => {
            let map = { getTileAt: () => { return parameter.tiles;}, replaceTile: ()=>{}};
            spyOn(map, 'replaceTile');
            let stubControls = { up: ()=> {return false;}, left: ()=> {return false;}, down: ()=>{return false;}, right: ()=>{return false;}};
            let player = new Player(map, stubControls);
            player.setPosX(1);
            player.setPosY(1);
            let dotEatenListener = jasmine.createSpy("dotEatenListener");
            player.setDotEatenEventListener(dotEatenListener);

            stubControls[parameter.pressedControl] = ()=>{return true;};
            player.update();

            expect(player.getPosX()).toBe(parameter.expectedPosX);
            expect(player.getPosY()).toBe(parameter.expectedPosY);
            expect(player.getEatenDots()).toBe(parameter.expectedEatenDots);
            expect(player.dotEatenEventListener).toHaveBeenCalledTimes(parameter.expectDotEatenEventFiredTimes);
            
            if (parameter.expectTileToBeReplaced) {
                expect(map.replaceTile).toHaveBeenCalledWith(1,0, Constants.MAP_FREE);
            } else {
                expect(map.replaceTile).toHaveBeenCalledTimes(0);
            }
            
        });
    });

    it("should start pair programming if stepping on pair programming field", ()=>{
        let map = { getTileAt: () => { return Constants.MAP_PAIRPROG; }, replaceTile: ()=>{}};
        spyOn(map, 'replaceTile');

        let stubControls = { up: ()=> {return true;}, left: ()=> {return false;}, down: ()=>{return false;}, right: ()=>{return false;}};
        let player = new Player(map, stubControls, 0, 0, 0, 100);

        player.update(0);

        expect(map.replaceTile).toHaveBeenCalledWith(0,-1, Constants.MAP_FREE);
        expect(player.getPairProgramming()).toBeTruthy();
        expect(player.getLeftPairProgrammingTime(0)).toBe(100);        
    });

    it("should stop pair programming after time span", ()=>{
        let map = { getTileAt: () => { return Constants.MAP_PAIRPROG; }, replaceTile: ()=>{}};
        spyOn(map, 'replaceTile');

        let stubControls = { up: ()=> {return true;}, left: ()=> {return false;}, down: ()=>{return false;}, right: ()=>{return false;}};
        let player = new Player(map, stubControls, 0, 0, 0, 100);

        player.update(0);
        expect(player.getPairProgramming()).toBeTruthy();
        stubControls.up = () => {return false;}

        player.update(100);
        expect(player.getLeftPairProgrammingTime(100)).toBe(0);        
        expect(player.getPairProgramming()).toBeFalsy();        
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

            let map = { getTileAt: () => { return Constants.MAP_FREE;}};
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

        let map = { getTileAt: () => { return Constants.MAP_FREE;}};
        let stubControls = { up: ()=> {return true;}, left: ()=> {return false;}, down: ()=>{return false;}, right: ()=>{return false;}};
        let player = new Player(map, stubControls, waitTimeInMs, waitTimeAfterMovementInMs, lastUpdatedAtTimeInMs);
        
        player.update(1);

        stubControls.up = () => { return false;};    
        player.update(251);
        expect(player.shouldUpdateAtTime(252)).toBeTruthy();        
    });
});