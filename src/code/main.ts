import { AppBuilder } from "./builder.js";
import { App } from "./app.js";

const builder = new AppBuilder();
const app: App = builder.build();
app.run();