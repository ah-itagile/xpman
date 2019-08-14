import TilePositionToPhaserTranslator from '../src/phaseradaptor/tilePositionToPhaserTranslator';

describe("TilePositionToPhaserTranslator", () => {
    [ { tileSize: 32, mazeOffsetY: 0, translateToX:1, translateToY:2, expectedPosX:32+16, expectedPosY: 64+16},
      { tileSize: 32, mazeOffsetY: 100, translateToX:1, translateToY:2, expectedPosX:32+16, expectedPosY: 64+16+100}].forEach((parameter) => {
        it("should calculate position on screen", () => {
            let translator = new TilePositionToPhaserTranslator(parameter.tileSize, parameter.mazeOffsetY);
            let posOnScreen = translator.translate(parameter.translateToX, parameter.translateToY);
            expect(posOnScreen.x).toBe(parameter.expectedPosX);
            expect(posOnScreen.y).toBe(parameter.expectedPosY);
        });
    });
});