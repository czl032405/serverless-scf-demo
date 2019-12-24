const copydir = require("copy-dir");
const path = require("path");
const del = require("del");
const fs = require("fs");
const copy = async function(source, dist) {
  var s = path.resolve(__dirname, source);
  var d = path.resolve(__dirname, dist);

  return new Promise((resolve, reject) => {
    copydir(s, d, function(err) {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(`[ok] ${dist}`);
        resolve();
      }
    });
  });
};

const copyFile = function(source, dist) {
  dist = dist || source;
  fs.createReadStream(source).pipe(fs.createWriteStream(`dist/${dist}`));
};

const run = async function() {
  del.sync(["dist/**", "!dist/node_modules", "!dist/package-lock.json"]);
  await copyFile("package.json");
  // await copy("_prod", "dist", { cover: true });
  // await copy("./server/dist", "dist/server", { cover: true });
  // await copy("./client/dist", "dist/server/client", { cover: true });
};

run();
