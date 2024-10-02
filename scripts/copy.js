import fs from "fs-extra";

try {
    console.log("start copying...");

    console.log("copying html files to dist...");
    fs.copySync("./src/html", "./dist/html");

    console.log("copying styles to dist...");
    fs.copySync("./src/styles", "./dist/styles");

    console.log("copying succeed.");
} catch (err) {
    console.error(err);
}
