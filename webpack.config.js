const config = require('./config.json');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const isProduction = !isDevelopment;

module.exports = {
  entry: ['./src/js/app.js'],
  output: {
    path: `${__dirname}/dist/js`,
  },
  mode: isDevelopment ? 'development' : 'production',
  devtool: isDevelopment ? 'cheap-module-inline-source-map' : 'none',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!bullets-js)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-flow'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
    ],
  }
};
