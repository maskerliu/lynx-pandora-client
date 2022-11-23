import chalk from 'chalk'
import express from 'express'
import fs from 'fs'
import path from 'path'
import cors from 'cors'
import { fileURLToPath } from 'url'
import webpack, { Configuration } from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import buildConfig from './build.config.json' assert { type: 'json' }
import webConfig from './webpack.web.config.js'

const Run_Mode_DEV = 'development'
const dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.NODE_ENV = Run_Mode_DEV

process.env.BUILD_CONFIG = JSON.stringify(buildConfig)

function startDevServer(config: Configuration, port: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    config.mode = Run_Mode_DEV
    const compiler = webpack(config)

    let serverConfig: WebpackDevServer.Configuration = {
      port: port,
      hot: true,
      liveReload: true,
      allowedHosts: "all",
      client: { logging: 'none' },
      static: { directory: path.join(dirname, './src/'), },
      setupMiddlewares(middlewares, devServer) {
        devServer.app?.use('/node_modules/', express.static(path.resolve(dirname, '../node_modules')))
        devServer.app?.use(cors({
          credentials: true,
          optionsSuccessStatus: 200,
        }))
        devServer.app?.use((_, res, next) => {
          // res.header('Cross-Origin-Embedder-Policy', 'require-corp')
          // res.header('Cross-Origin-Opener-Policy', 'same-origin')
          res.header('Cross-Origin-Resource-Policy', 'cross-origin')
          res.header('Access-Control-Allow-Origin', '*')
          next()
        })
        devServer.middleware?.waitUntilValid(() => { resolve() })
        return middlewares
      }
    }

    if (buildConfig.protocol == 'https') {
      serverConfig.https = {
        key: fs.readFileSync('cert/private.key'),
        cert: fs.readFileSync('cert/mydomain.crt')
      }
    }

    const server = new WebpackDevServer(serverConfig, compiler)

    server.start()
      .then(() => resolve())
      .catch(err => {
        console.error(`fail to start ${config.target} server`, err)
        reject()
      })
  })
}

function greeting() {
  console.log(chalk.green('\n  vue3 via webpack5'))
  console.log(chalk.blue('  getting ready...') + '\n')
}

async function start() {
  greeting()

  try {
    let localIPv4 = await WebpackDevServer.internalIP('v4')
    await Promise.all([startDevServer(webConfig.init(localIPv4), 9081),])
  } catch (err) {
    console.error(err)
  }
}

start()