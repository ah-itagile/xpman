import PhaserMapAdaptor from '../src/phaseradaptor/PhaserMapAdaptor'
import * as Constants from '../src/model/constants'
import * as TilesConstants from '../src/phaseradaptor/TilesConstants'

describe("PhaserMapAdaptor", () => {
    [{phaserMapTile:TilesConstants.EmptyField, expectedMappedTile:Constants.MAP_FREE},
     {phaserMapTile:TilesConstants.OccupiedField, expectedMappedTile:Constants.MAP_WALL},
     {phaserMapTile:TilesConstants.PillField, expectedMappedTile:Constants.MAP_PILL}].forEach((parameter) => {
        it("should map tile map tiles to domain tiles", ()=>{
            let phaserMap = { getTileAt: ()=>{
                    return {
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
});