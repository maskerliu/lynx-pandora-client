'use strict'

import chalk from 'chalk'
import { deleteSync } from 'del'
import webpack from 'webpack'
import webConfig, { WebConfig } from './webpack.web.config.js'

const Run_Mode_PROD = 'production'
const doneLog = chalk.bgGreen.white(' DONE ') + ' '

process.env.NODE_ENV = Run_Mode_PROD
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

function run() {
  if (process.env.BUILD_TARGET === 'clean') clean()
  web()
}

function clean() {
  deleteSync(['build/*', '!build/icons', '!build/icons/icon.*'])
  console.log(`\n${doneLog}\n`)
  process.exit()
}

function pack(config: WebConfig): Promise<string> {
  return new Promise((resolve, reject) => {
    config.init().mode = Run_Mode_PROD
    webpack(config, (err, stats) => {
      if (err) {
        reject(err.stack || err)
      } else if (stats?.hasErrors()) {
        let err = ''
        stats.toString({ chunks: false, colors: true })
          .split(/\r?\n/)
          .forEach(line => { err += `    ${line}\n` })
        reject(err)
      } else {
        resolve(stats!.toString({ chunks: false, colors: true }))
      }
    })
  })
}

function web() {
  deleteSync(['dist/web/*', '!.gitkeep'])
  webConfig.init().mode = Run_Mode_PROD
  pack(webConfig)
}

run()