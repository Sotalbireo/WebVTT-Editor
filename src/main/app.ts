// const electron = require('electron')
import * as electron from 'electron'
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog
// const ipcMain = electron.ipcMain


const menu = electron.Menu.buildFromTemplate([
	{
		label: 'Edit/View',
		submenu: [
			{
				label: 'Open subtitle File',
				click: function() {
					dialog.showOpenDialog({
						title: "字幕ファイルを開く",
						filters: [
							{name: 'VTT File',  extensions:['vtt']},
							{name: 'all Files', extensions:['*']}
						],
						properties: ['openFile']
					},
					function(filePaths:string[]) {
						mainWindow.webContents.send('Open-subtitle-file', filePaths[0])
					}
				)}
			},
			{ type: 'separator'},
			{
				label: 'Combine subtitle & timestamp files',
				click: function() {
				}
			},
			{ type: 'separator'},
			{ role: 'reload'},
			{ type: 'separator'},
			{ role: 'toggledevtools'},
			{ type: 'separator'},
			{ role: 'close'}
		]
	},
	{
		label: 'Verify',
		submenu: [
			{
				label: 'for Open file'
			},
			{
				label: 'for Now used file',
				click: function(){mainWindow.webContents.send('Verify-for-Now-used-file', 1)}
			}
		]
	}
])

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow: any

app.on('ready', createWindow)
app.on('window-all-closed', function(){
	if (process.platform !== 'darwin') app.quit()
})
// On OS X it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
app.on('activate', function(){
	if (mainWindow === null) createWindow()
})

function createWindow () {
	mainWindow = new BrowserWindow({
		width: 1024,
		height: 768,
		resizable: true,
		title: "WEBVTT Editor"
	})
	mainWindow.setMenu(menu)
	mainWindow.loadURL(require('url').format({
		pathname: require('path').join(__dirname, 'index.html'),
		protocol: 'file',
		slashes: true
	}))

	mainWindow.webContents.openDevTools()

	mainWindow.on('closed', function(){
		mainWindow = null
	})
}

