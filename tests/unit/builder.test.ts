import { expect } from "chai";
import { AppBuilder } from "../../src/code/builder.js";

describe('app builder', () => {
    it('build return app', () => {
        const builder = new AppBuilder();
        const app = builder.build();
        expect(app).to.exist;
    });
});