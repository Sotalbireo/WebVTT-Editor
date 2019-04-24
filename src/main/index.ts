const path = require('path')
const { app, BrowserWindow } = require('electron')
const waitOn = require('wait-on')

const express = require('express')
const getPort = require('get-port')
const useragent = require('express-useragent')

let win

function loadContent(port = 3000) {
  win = new BrowserWindow({
    width: 1280,
    height: 768,
    minWidth: 1280,
    minHeight: 768,
    title: 'WebVTT Editor (beta)',
    webPreferences: {
      textAreasAreResizable: false
    }
  })
  win.loadURL(`http://localhost:${port}`)
}

app.on('ready', () => {
  if (process.env.NODE_ENV === 'development') {
    // Importing dev dependencies
    const {
      default: installExtension,
      VUEJS_DEVTOOLS
    } = require('electron-devtools-installer')

    // Installing devtools
    installExtension(VUEJS_DEVTOOLS).then(() => {
      waitOn({ resources: [`http://localhost:3000`], log: true }, () => {
        loadContent()
      })
    })
  } else {
    const server: any = express()
    server.use(useragent.express())

    // Rejecting requests from browsers
    server.use((req: any, res: any, next: any) => {
      if (req.useragent.source.includes('Electron')) next()
      else res.end()
    })
    server.use(express.static(path.resolve(__dirname, '../renderer')))

    getPort().then((port: number) => {
      server.listen(port, 'localhost', () => {
        loadContent(port)
      })
    })
  }
})
