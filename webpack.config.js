module.exports = {
  entry: {
    'audio-player': './src/audio-player.js'
  },
  output: {
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          'postcss-loader'
        ]
      }
    ]
  }
}
