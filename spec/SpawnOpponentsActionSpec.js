import SpawnOpponentsAction from "../src/phaseradaptor/SpawnOpponentsAction";
import * as Constants from '../src/model/constants';

describe("Spawn opponent action", ()=>{

    let game;
    let config;
    let mapAdaptor;
    let scene;
    let action;
    let display;

    beforeEach(()=>{
        game = jasmine.createSpyObj("game", ["addOpponent"]);
        config = { spawnOpponents: { spawnX: 77, spawnY: 88 }};
        mapAdaptor = {};
        scene = { add: { 
            image: ()=>{}
        }}
        display = jasmine.createSpyObj("display", ["showMessage"]);
        action = new SpawnOpponentsAction(100, 0, 2,1, game,config, mapAdaptor, scene, 16, 50, display);
    });

    it("should decrease counter when updating", ()=>{
        action.update();

        expect(display.showMessage).toHaveBeenCalledWith("CI Countdown:1");
    });

    it("should add opponent to game when counter is zero", ()=>{
        action.update();
        expect(game.addOpponent).not.toHaveBeenCalled();

        action.update();
        expect(game.addOpponent).toHaveBeenCalled();
        let spawnedOpponent = game.addOpponent.calls.argsFor(0)[0];
        expect(spawnedOpponent.getPosX()).toBe(77);
        expect(spawnedOpponent.getPosY()).toBe(88);
        expect(spawnedOpponent.getKillableByPairProgramming()).toBeTruthy();
    });

    it("should reset counter after opponent was spawned", ()=>{
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