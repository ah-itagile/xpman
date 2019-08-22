import Phaser from "phaser";
import tilesImg from "../assets/xpman-tileset.png";
import playerImg from "../assets/player.png";
import opponentPng from "../assets/manager.png";
import bugPng from "../assets/bug.png";
import tileMapLevel1 from "../assets/xpman-level1.csv";
import tileMapLevel2 from "../assets/xpman-level2.csv";

import Opponent from '../model/opponent';
import PhaserOpponent from '../phaseradaptor/phaseropponent';
import PhaserKeyControlsAdapter from "../phaseradaptor/phaserKeyControlsAdaptor";
import PhaserMapAdaptor from '../phaseradaptor/PhaserMapAdaptor';
import PhaserPointsDisplay from '../phaseradaptor/phaserPointsDisplay';
import PhaserLivesDisplay from '../phaseradaptor/phaserLivesDisplay';
import Player from "../model/player";
import PhaserPlayer from "../phaseradaptor/phaserPlayer";
import XPManGame from '../model/xpmanGame';
import PhaserRandomMoveDecider from "../phaseradaptor/phaserRandomMoveDecider";
import OpponentPossibleMovesFinder from "../model/opponentPossibleMovesFinder";
import ChasingMoveDecider from "../model/chasingMoveDecider";
import PhaserCiCounterDisplay from "../phaseradaptor/phaserCiCounterDisplay";
import SpawnOpponentsAction from "../phaseradaptor/SpawnOpponentsAction";
import PhaserPairProgrammingDisplay from "../phaseradaptor/phaserPairProgrammingDisplay";
import PairProgrammingTimedAction from "../model/PairProgrammingTimedAction";


export default class GameScene extends Phaser.Scene {

  constructor (config) {
      super(config);
      this.tilesize = 32;
      this.offset = (this.tilesize / 2)
      this.mazeOffsetY = 20;
  }

  init(xpmanGame) {
    this.xpmanGame = xpmanGame;
  }
  
  preload ()
  {
      this.load.image('tiles', tilesImg);
      this.load.image('player', playerImg);
      this.load.image('opponent', opponentPng);
      this.load.image('bug', bugPng);
      this.load.tilemapCSV('tileMapLevel1', tileMapLevel1);
      this.load.tilemapCSV('tileMapLevel2', tileMapLevel2);
  }
  
  create ()
  {
      let levelConfig = this.xpmanGame.getLevelConfigs()[this.xpmanGame.getCurrentLevel()-1];
      let pointsDisplay = new PhaserPointsDisplay(this);
      let playerLivesLeftDisplay = new PhaserLivesDisplay(this);
      let phaserTileMap = this.make.tilemap({ key: this.xpmanGame.getLevelConfigs()[this.xpmanGame.getCurrentLevel()-1].mapName, tileWidth: this.tilesize, tileHeight: this.tilesize });
      var tileset = phaserTileMap.addTilesetImage('tiles', null, this.tilesize, this.tilesize, 0, 0);
      phaserTileMap.createDynamicLayer(0, tileset, 0, this.mazeOffsetY);

      let mapAdaptor = new PhaserMapAdaptor(phaserTileMap);
      let phaserOpponents = [];
      let phaserRandomMoveDecider = new PhaserRandomMoveDecider();
      let possibleMovesFinder = new OpponentPossibleMovesFinder();
      let chasingMoveDecider = new ChasingMoveDecider(phaserRandomMoveDecider);
      levelConfig.opponents.forEach((opponent) => {
        let opponentModel = new Opponent(mapAdaptor, levelConfig.opponentStepTime, 0, chasingMoveDecider, possibleMovesFinder, false);
        phaserOpponents.push(new PhaserOpponent(this, this.tilesize, 'opponent', opponentModel, this.mazeOffsetY));
      });
      this.phaserKeyAdaptor = new PhaserKeyControlsAdapter(this);
      let playerModel = new Player(mapAdaptor, this.phaserKeyAdaptor, 1, 250, 0, 5000);
      let phaserPlayer = new PhaserPlayer(this, this.tilesize, 'player', playerModel, this.mazeOffsetY);
      let ciCounterDisplay = new PhaserCiCounterDisplay(this);
      let pairProgrammingDisplay = new PhaserPairProgrammingDisplay(this);
      let pairProgrammingTimedAction = new PairProgrammingTimedAction(0, 0, playerModel, 2000, pairProgrammingDisplay);
      let spawnOpponentsAction = new SpawnOpponentsAction(200, 0, 500, 10, this.xpmanGame, 
        levelConfig, mapAdaptor, this, this.tilesize, this.mazeOffsetY, ciCounterDisplay, 'bug');
      this.xpmanGame.setTimedActions([spawnOpponentsAction, pairProgrammingTimedAction]);
      this.levelFinishedCallback = () => { 
        this.scene.stop()        
        this.scene.start('NextLevel', this.xpmanGame);
      };
      this.gameOverCallback = () => { 
        this.scene.stop()        
        this.scene.start('GameOver');
      };
      this.endGameCallback = () => { 
        this.scene.stop()        
        this.scene.start('EndGame', this.xpmanGame);
      };
      this.lifeLostDisplay = { showMessage: (message) => { 
        this.scene.pause('Game')        
        this.scene.launch('LifeLost', message);
      }};
      this.xpmanGame.setMapAdaptor(mapAdaptor);
      this.xpmanGame.setInitialOpponents(phaserOpponents);
      this.xpmanGame.setPlayer(phaserPlayer);
      this.xpmanGame.setLevelFinishedCallback(this.levelFinishedCallback);
      this.xpmanGame.setPlayerLivesLeftDisplay(playerLivesLeftDisplay);
      this.xpmanGame.setGameOverCallback(this.gameOverCallback);
      this.xpmanGame.setEndGameCallback(this.endGameCallback);
      this.xpmanGame.setLifeLostDisplay(this.lifeLostDisplay);
      this.xpmanGame.setPointsDisplay(pointsDisplay);      
      this.xpmanGame.initializeLevel();
      this.events.on('resume', ()=>{
        this.phaserKeyAdaptor.reset();
        this.xpmanGame.continueAfterLifeLost();
      });

      this.keyL_ONLY_FOR_DEVELOPMENT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
  }

  // only for development
  isLevelEndForced() {
    return this.keyL_ONLY_FOR_DEVELOPMENT.isDown;
  }
  
  update(time, delta) {
    let forceLevelEnd = this.isLevelEndForced();
    this.xpmanGame.update(time, forceLevelEnd);
  }
}