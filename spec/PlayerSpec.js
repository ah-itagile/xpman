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
});