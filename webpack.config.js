const path = require('path');

module.exports = {
  devtool : 'inline-source-map',
  entry   : './src/index.ts',
  mode    : 'production',
  module  : {
    rules : [
      {
        test : /\.tsx?$/,
        use  : 'ts-loader'
      }
    ]
  },
  output  : {
    filename      : 'main.js',
    library       : 'SVGChrtColumn',
    libraryTarget : 'var',
    path          : path.resolve(__dirname, 'dist')
  },
  resolve : {
    extensions : [
      '.tsx',
      '.ts',
      '.js'
    ]
  }
};
