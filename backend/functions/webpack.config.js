var path = require("path")
var nodeExternals = require("webpack-node-externals")

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.bundle.js"
  },
  resolve: {
    // Import files with this extensions without writing .ts
    extensions: [".ts"]
  },
  module: {
    rules: [
      {
        // Include ts files.
        test: /\.(ts)$/,
        loader: "babel-loader"
      }
    ]
  },
  target: "node",
  //Exclude all node_modues from being included in bundle
  externals: [nodeExternals()]
}
