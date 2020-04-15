const path = require(`path`); // 安全にパスを解決する

const BROWSER_SYNC = {
  port: 3000,
  files: "./dist/**/*",
  server: {
    baseDir: "./dist/",
    index: "index.html",
    serveStaticOptions: {
      extensions: ["html"]
    }
  }
};

module.exports = BROWSER_SYNC;
