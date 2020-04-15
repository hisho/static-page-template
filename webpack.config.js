const webpack = require('webpack'); //webpack本体
const path = require('path'); // 安全にパスを解決する
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin'); // CSSを取り出す
const StyleLintPlugin = require('stylelint-webpack-plugin'); // stylelintを使う
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries'); // 余分なJSを出さない
const CopyWebpackPlugin = require('copy-webpack-plugin'); //ディレクトリをコピーする
const TerserPlugin = require('terser-webpack-plugin'); //JSの圧縮
const ForkTsCheckerWebpackPlugin = require(`fork-ts-checker-webpack-plugin`); //TSの型チェックを別スレッドで実行するのに必要
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); //CSSの圧縮
const ImageMinPlugin = require('imagemin-webpack-plugin').default;
const ImageMinMozjpeg = require('imagemin-mozjpeg');
const ImageMinPngquant = require('imagemin-pngquant');
const ImageMinSvgo = require('imagemin-svgo');

module.exports = (env,argv) => {
  const MODE = argv.mode;
  const IS_DEVELOPMENT = argv.mode === 'development';
  const IS_PRODUCTION = argv.mode === 'production';
  return {
    mode: MODE,
    devtool: IS_DEVELOPMENT ? 'inline-source-map' : 'none',
    entry: {
        "dist/assets/js/main": "./src/@js/main",
        "dist/assets/css/common": "./src/@scss/common",
    },
    output: {
      filename: '[name].js',
      path: path.join(__dirname)
    },
    resolve: {
      extensions: ['.js','.ts','.scss'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          exclude: /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                experimentalWatchApi: true,
              }
            }
          ]
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
            {loader: ExtractCssChunks.loader},
            {
              loader: 'css-loader',
              options: {
                url: false,
                sourceMap: true
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: [
                  require(`postcss-sort-media-queries`)({ sort: 'mobile-first' }),
                  require('postcss-viewport-height-correction'),
                  require(`autoprefixer`)({ grid: 'autoplace' }),
                ],
              }
            },
            {
              loader: 'sass-loader',
              options: {
                //Dart SASSを使う
                implementation: require('sass', { outputStyle: 'expanded' }),
                sassOptions: {
                  fiber: require('fibers'),
                },
              }
            }
          ]
        },
        {
          enforce: "pre",
          test: /\.scss$/,
          exclude: /node_modules/,
          use: ["import-glob-loader"]
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin([
        {
          test: /\.(jpg|png|svg)$/i,
          force: true,
          from: path.resolve(__dirname,'src/img'),
          to: path.resolve(__dirname,'dist/assets/img')
        }
      ]),
      new ImageMinPlugin({
        test: /\.(jpg|png|svg)$/i,
        cacheFolder: path.resolve(__dirname,`./_cash`),
        plugins: [
          ImageMinMozjpeg({ quality: 80 }),
          ImageMinPngquant([0.6, 0.9]),
          ImageMinSvgo({
            plugins: [
              {removeViewBox: false}
            ]
          })
        ]
      }),
      new FixStyleOnlyEntriesPlugin(),
      new ExtractCssChunks({
        filename: "[name].css",
        chunkFilename: "[id].css",
        orderWarning: true,
      }),
      new CopyWebpackPlugin([
        {
          test: /\.ico$/i,
          force: true,
          from: path.resolve(__dirname,'src/favicon'),
          to: path.resolve(__dirname,'dist/assets/img/favicon')
        }
      ]),
      new StyleLintPlugin({fix: true}),
      new ForkTsCheckerWebpackPlugin(), //typeScriptの型チェックを別スレッドでする
      new webpack.ProgressPlugin(), //webpackの進捗をコンソールに表示する
    ],
    optimization: {
      minimize: IS_PRODUCTION,
      splitChunks: {
        name: `dist/assets/js/modules`,
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              const vendor = [];
              for (let i = vendor.length - 1; i >= 0; i--) {
                if (packageName.match(vendor[i]))
                  return `dist/assets/js/${vendor[i]}`;
              }
              return `dist/assets/js/vendor`;
            }
          }
        }
      },
      minimizer: [
        new TerserPlugin({
          extractComments: true,
          cache: true,
          parallel: true,
          terserOptions: {
            extractComments: 'all',
            compress: {
              drop_console: true,
            },
          }
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessor: require('cssnano',{autoprefixer: false}),
          cssProcessorPluginOptions: {
            preset: ['default', { discardComments: { removeAll: true } }],
          },
          canPrint: true
        })
      ]
    }
  }
};
