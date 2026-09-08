const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const share = mf.share;
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin

module.exports = {
  output: {
    uniqueName: "plataformaresseguroMfe",
    publicPath: "auto",
    scriptType: "text/javascript"
  },
  optimization: {
    runtimeChunk: false,
  },
  resolve: {
    alias: {},
  },
  plugins: [
    new ModuleFederationPlugin({
      remotes: {},
      name: "plataformaresseguroMfe",
      filename: "remoteEntry.js",
      exposes: {
        "./web-components": "./src/bootstrap.ts",
      },
      shared: share({
        "@angular/core": {
          requiredVersion: "auto",
        },
        "@angular/common": {
          requiredVersion: "auto",
        },
        "@angular/common/http": {
          requiredVersion: "auto",
        },
        "@angular/router": {
          requiredVersion: "auto",
        },
        "@angular/forms": {
          requiredVersion: "auto",
        },
        "@angular/platform-browser": {
          requiredVersion: "auto",
        },
        "@ids/angular": {
          requiredVersion: "auto",
        },
        "rxjs": {
          requiredVersion: "auto",
        },
      }),
    }),
    new BundleAnalyzerPlugin({ analyzerMode:"static", "openAnalyzer": false }),
  ],
};