import path from 'path'
import CompressionPlugin from 'compression-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin' // used for packaging css into bundles
import {
  Configuration as WebpackConfiguration,
  HotModuleReplacementPlugin,
  DefinePlugin,
} from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration
}
interface IArguments {
  production: boolean
  REACT_APP_VERSION: string
}
type Imode = 'none' | 'development' | 'production'
const config = (env: IArguments): Configuration => {
  let environment: Imode = 'none'
  let devtool = ''
  let isProduction = false
  const plugin: any[] = [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin(),
    new DefinePlugin({ 'process.env.REACT_APP_VERSION': JSON.stringify(env.REACT_APP_VERSION) }),
  ]
  process.env.REACT_APP_VERSION = env.REACT_APP_VERSION
  if (env) {
    environment = env.production ? 'production' : 'development'
  } else {
    environment = 'development'
  }

  isProduction = environment === 'production'
  if (!isProduction) {
    devtool = 'eval-source-map'
    // plugin.push(new BundleAnalyzerPlugin())
  } else {
    devtool = 'source-map'
    plugin.push(new CompressionPlugin())
  }

  return {
    mode: environment,
    devtool,
    entry: {
      bundle: path.resolve(__dirname, 'src/index.tsx'),
    },
    output: {
      publicPath: '/',
      chunkFilename: '[name].bundle.js',
    },
    module: {
      rules: [
        // tsx jsx babel-loader
        {
          test: /\.(ts|js)x?$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
            },
          },
        },
        // less-loader
        {
          test: /\.less$/i,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  strictMath: true,
                },
              },
            },
          ],
        },
        // scss loader
        {
          test: /\.(s)?css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        // png svg url-loader
        {
          test: /\.(jpg|gif|png|svg|cur)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                outputPath: 'images',
              },
            },
          ],
        },
      ],
    },
    resolve: {
      alias: {
        src: path.resolve(__dirname, 'src'),
      },
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    plugins: plugin,
    devServer: {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      compress: true,
      static: path.join(__dirname, 'build'),
      historyApiFallback: true,
      port: 4200,
      open: true,
      hot: !isProduction,
    },
  }
}

export default config
