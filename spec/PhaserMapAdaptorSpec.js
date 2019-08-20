import PhaserMapAdaptor from '../src/phaseradaptor/PhaserMapAdaptor'
import * as Constants from '../src/model/constants'
import * as TilesConstants from '../src/phaseradaptor/TilesConstants'

describe("PhaserMapAdaptor", () => {
    [{phaserMapTile:TilesConstants.EmptyField, expectedMappedTile:Constants.MAP_FREE},
     {phaserMapTile:TilesConstants.OccupiedField, expectedMappedTile:Constants.MAP_WALL},
     {phaserMapTile:null, expectedMappedTile:Constants.MAP_UNSET},
     {phaserMapTile:TilesConstants.CiServerField, expectedMappedTile:Constants.MAP_CI_SERVER},
     {phaserMapTile:TilesConstants.PairProgField, expectedMappedTile:Constants.MAP_PAIRPROG},
     {phaserMapTile:TilesConstants.DotField, expectedMappedTile:Constants.MAP_DOT}].forEach((parameter) => {
        it("should map tile map tiles to domain tiles", ()=>{
            let phaserMap = { getTileAt: ()=>{
                if (parameter.phaserMapTile===null) return null;
                    else return {
                        index: parameter.phaserMapTile
                    }
                }
            };
            let phaserMapAdapter = new PhaserMapAdaptor(phaserMap);

            let mappedTile = phaserMapAdapter.getTileAt(0,0);

            expect(mappedTile).toBe(parameter.expectedMappedTile);
        });
    });

    [{newDomainMapTile:Constants.MAP_FREE, expectedReplacementTile:TilesConstants.EmptyField}].forEach((parameter) => {
        it("should replace map tile for given domain tile", ()=>{
            let phaserMapMock = jasmine.createSpyObj("phaserMap", ["putTileAt"]);
            let phaserMapAdapter = new PhaserMapAdaptor(phaserMapMock);

            phaserMapAdapter.replaceTile(0,0, parameter.newDomainMapTile);

            expect(phaserMapMock.putTileAt).toHaveBeenCalledWith(parameter.expectedReplacementTile, 0,0);
        });
    });

    
    it("should count initial amount of dots to be eaten", ()=>{
        let phaserMapMock = {
            height: 2,
            width: 2,
            getTileAt: (x,y) => { 
                if (x==1&&y==1) {
                    return {index: TilesConstants.EmptyField}; 
                } else return {index: TilesConstants.DotField};
            }
        };
        let phaserMapAdapter = new PhaserMapAdaptor(phaserMapMock);

        let dotCount = phaserMapAdapter.countDots();

        expect(dotCount).toBe(3);
    });

    it("should skip unset tiles when counting dots", ()=>{
        let phaserMapMock = {
            height: 2,
            width: 2,
            getTileAt: (x,y) => { 
                if (x==1&&y==1) {
                    return null; 
                } else return {index: TilesConstants.DotField};
            }
        };
        let phaserMapAdapter = new PhaserMapAdaptor(phaserMapMock);

        let dotCount = phaserMapAdapter.countDots();

        expect(dotCount).toBe(3);
    });

});