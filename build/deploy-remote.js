'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.remote.conf')

// ssh操作相关的导入
const Client = require('ssh2').Client
const conn = new Client()
const fs = require('fs')

const spinner = ora('deploying for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Building complete.\n'))
    // upload()
    deployRemote()
  })
})

// 开始连接服务端ssh，并发布打包好的文件
function deployRemote() {
  conn.on('ready', function () {
    console.log(chalk.cyan('  SSH Client: ready'))
    uploadFile(conn)
  }).connect({
    host: config.build.remoteHost,
    port: config.build.remotePort,
    username: config.build.remoteUsername,
    password: config.build.remotePassword
  })
}

/**
 * 上传文件
 * @param conn
 * @param params
 * @constructor
 */
function uploadFile(conn) {
  const file = config.build.sftpFromPath
  const target = config.build.assetsRootRemote + '/' + config.build.remoteFileName
  if (!conn) {
    spinner.stop()
    console.log(chalk.red('  Uploading fail: ssh conn not ready\n'))
    return
  }

  conn.sftp(function (err, sftp) {
    if (err) {
      spinner.stop()
      console.log(chalk.red('  Uploading fail: \n' + err.message))
      throw err
    }

    sftp.fastPut(file, target, {}, function (err, result) {
      if (err) {
        spinner.stop()
        console.log(chalk.red('  Uploading fail: \n' + err.message))
        throw err
      }

      console.log(chalk.cyan('  Uploading success: \n'))
      uploadShellAction(conn)
    })
  })
}

/**
 * 发布脚本
 *
 * 1.进入目录
 * 2.删除旧的压缩包
 * 3.解压压缩包
 * 4.备份压缩包
 * 5.退出
 * @type {string[]}
 */
const uploadShellList = [
  `cd ${config.build.assetsRootRemote}\n`,
  `rm -rf ${config.build.remoteFileName}.bak\n`,
  `unzip ${config.build.remoteFileName}\n`,
  `mv ${config.build.remoteFileName} ${config.build.remoteFileName}.bak\n`,
  `exit\n`
]

/**
 * 上传前在服务器需要执行的内容
 * 删除压缩文件和发布的文件夹
 * @param conn ssh连接客户端
 * @constructor
 */
function uploadShellAction (conn) {
  conn.shell(function (err, stream) {
    if (err) throw err
    stream.on('close', function () {
      spinner.stop()
      console.log(chalk.cyan(' SSH Stream: close'))
      conn.end()

      // 删除本地的压缩包，避免其他人误解以为打包出来有压缩包
      fs.unlinkSync(config.build.sftpFromPath)
    }).on('data', function (data) {
      console.log(chalk.cyan('  SSH STDOUT: ' + data))
    }).stderr.on('data', function (data) {
      console.log(chalk.cyan('  SSH STDERR: ' + data))
    })
    stream.end(uploadShellList.join(''))
  })
}
