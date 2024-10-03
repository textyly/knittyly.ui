import { App } from "./app.js";

export class AppBuilder {
    public build(): App {
        const app: App = new App();
        return app;
    }
}