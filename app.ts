const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const fs = require('fs')
const path = require('path')
const url = require('url')
// const mimeTypes = {
// 	"html": "text/html",
// 	"png": "image/png",
// 	"js": "text/javascript",
// 	"css": "text/css",
// 	"txt": "text/plain",
// 	"vtt": "text/vtt",
// 	"mp4": "video/mp4"
// }
const menu = electron.Menu.buildFromTemplate([
	{
		label: 'Edit/View',
		submenu: [
			{
				label: 'Open Files',
				click() { console.log('test')}
			},
			{ role: 'reload'},
			{ type: 'separator'},
			{ role: 'toggledevtools'},
			{ type: 'separator'},
			{ role: 'close'}
		]
	}
])

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: any

app.on('ready', createWindow)
app.on('window-all-closed', ()=>{
	if (process.platform !== 'darwin') app.quit()
})
// On OS X it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
app.on('activate', ()=>{
	if (mainWindow === null) createWindow()
})

function createWindow () {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		resizable: true
	})
	// mainWindow.setMenu(null)
	mainWindow.setMenu(menu)
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}))

	mainWindow.webContents.openDevTools()

	mainWindow.on('closed', ()=>{
		mainWindow = null
	})
}
