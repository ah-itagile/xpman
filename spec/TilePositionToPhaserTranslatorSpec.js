import TilePositionToPhaserTranslator from '../src/phaseradapter/tilePositionToPhaserTranslator';

describe("TilePositionToPhaserTranslator", () => {
    it("should calculate position on screen", () => {
        let translator = new TilePositionToPhaserTranslator(32);
        let posOnScreen = translator.translate(1,2);
        expect(posOnScreen.x).toBe(32+16);
        expect(posOnScreen.y).toBe(64+16);
    });
});