module.exports = {
  plugins: [
    require('autoprefixer'),
    require('cssnano'),
    require('postcss-url')({url: 'inline'})
  ]
}
