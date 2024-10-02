import fs from "fs-extra";

try {
    console.log("start copying...");

    console.log("copying index.html files to dist...");
    fs.copyFileSync("./src/index.html", "./dist/index.html");

    console.log("copying rest of the html files to dist...");
    fs.copySync("./src/html", "./dist/html");

    console.log("copying styles to dist...");
    fs.copySync("./src/styles", "./dist/styles");

    console.log("copying succeed.");
} catch (err) {
    console.error(err);
}
