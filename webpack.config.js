const path = require('path')

module.exports = {
  target: 'node',
  entry: './src/index.ts',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            projectReferences: true,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [path.join(__dirname, 'node_modules')],
  },
  mode: 'development',
}
