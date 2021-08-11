const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

// Version if the local Node.js version supports async/await
// webpack.config.js

module.exports = (async () => {
  return {
    mode: "production",
    entry: "./src/local.ts",
    target: "node",
    optimization: {
      // minimize: false, // <---- disables uglify.
      // minimizer: [new UglifyJsPlugin()] if you want to customize it.
    },
    externals: {
      "@prisma/client": "@prisma/client",
      ".prisma/client": ".prisma/client",
      prisma: "prisma",
    },
    output: {
      libraryTarget: "commonjs",
      path: path.resolve(__dirname, "dist"),
      filename: "local.js",
    },
    
    resolve: {
      symlinks: false,
      extensions: [".ts", ".js", ".tsx"],
      plugins: [new TsconfigPathsPlugin()],
    },
    module: {
      rules: [{ test: /\.ts?$/, loader: "ts-loader" }],
    },
  };
})();
