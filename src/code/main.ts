import { CanvasBuilder } from "./builder.js";

const canvasBuilder = new CanvasBuilder();
const canvas = canvasBuilder.build();

const size = { width: window.innerWidth, height: window.innerHeight };
canvas.size = size;

canvas.draw();