/* eslint no-console:0 */

import { app, BrowserWindow } from 'electron'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import waitOn from 'wait-on'
import nuxtConfig from 'nuxt.config'

let win: BrowserWindow | null = null

function newWindow() {
  const host = nuxtConfig.server?.host || 'localhost'
  const port = Number(nuxtConfig.server?.port) || 3000
  const resource = `//${host}:${port}`

  win = new BrowserWindow({
    width: 1024,
    height: 768,
    title: nuxtConfig.head?.title || '',
    webPreferences: {
      contextIsolation: true,
      devTools: nuxtConfig.dev,
      sandbox: true,
      textAreasAreResizable: false
    }
  })

  win.on('closed', () => (win = null))

  if (nuxtConfig.dev) {
    installExtension(VUEJS_DEVTOOLS.id)
      .then((name) => {
        console.log(`Added Extension:  ${name}`)
        win!.webContents.openDevTools()
      })
      .catch((err) => console.log('An error occurred: ', err))
      .then(() => {
        waitOn(
          {
            resources: [resource],
            log: true
          },
          () => {
            win!.loadURL(resource)
          }
        )
      })
  } else {
    win.loadURL(resource)
  }
}

app.on('ready', newWindow)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => win === null && newWindow())
