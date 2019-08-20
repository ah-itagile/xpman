import SpawnGhostsAction from "../src/phaseradaptor/SpawnGhostsAction";
import * as Constants from '../src/model/constants';

describe("Spawn ghost action", ()=>{

    let game;
    let config;
    let mapAdaptor;
    let scene;
    let action;
    let display;

    beforeEach(()=>{
        game = jasmine.createSpyObj("game", ["addGhost"]);
        config = { spawnGhosts: { spawnX: 77, spawnY: 88 }};
        mapAdaptor = {};
        scene = { add: { 
            image: ()=>{}
        }}
        display = jasmine.createSpyObj("display", ["showMessage"]);
        action = new SpawnGhostsAction(100, 0, 2,1, game,config, mapAdaptor, scene, 16, 50, display);
    });

    it("should decrease counter when updating", ()=>{
        action.update();

        expect(display.showMessage).toHaveBeenCalledWith("CI Countdown:1");
    });

    it("should add ghost to game when counter is zero", ()=>{
        action.update();
        expect(game.addGhost).not.toHaveBeenCalled();

        action.update();
        expect(game.addGhost).toHaveBeenCalled();
        let spawnedGhost = game.addGhost.calls.argsFor(0)[0];
        expect(spawnedGhost.getPosX()).toBe(77);
        expect(spawnedGhost.getPosY()).toBe(88);
    });

    it("should reset counter after ghost was spawned", ()=>{
        action.update();
        action.update();
        expect(display.showMessage).toHaveBeenCalledWith("CI Countdown:2");
    });

    it("should reset counter if player stepped on CI server", ()=>{
        action.update();
        action.playerSteppedOn(Constants.MAP_CI_SERVER); 
        expect(display.showMessage).toHaveBeenCalledWith("CI Countdown:2");
    });

    it("should reset counter after reset was triggered", ()=>{
        action.reset();            
        expect(display.showMessage).toHaveBeenCalledWith("CI Countdown:2");
    });

});