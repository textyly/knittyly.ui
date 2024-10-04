import { expect } from "chai";
import { AppBuilder } from "../../src/code/builder.js";

describe('app builder', () => {
    it('return app must be defined.', () => {
        const builder = new AppBuilder();
        const app = builder.build();
        expect(app).to.exist;
    });
});