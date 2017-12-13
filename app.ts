const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog
const ipcMain = electron.ipcMain

const { VttParser } = require('./assets/parser')

const menu = electron.Menu.buildFromTemplate([
	{
		label: 'Edit/View',
		submenu: [
			{
				label: 'Open subtitle File',
				click: function(){ dialog.showOpenDialog(
					{
						title: "字幕ファイルを開く",
						filters: [
							{name: 'VTT File',  extensions:['vtt']},
							{name: 'all Files', extensions:['*']}
						],
						properties: ['openFile']
					},
					(filePaths:string[]) => {
						console.log(filePaths)
						mainWindow.webContents.send('tst', filePaths)
						console.log(VttParser)
					}
				)}
			},
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
				label: 'for Now used file'
			}
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

	mainWindow.on('closed', ()=>{
		mainWindow = null
	})
}

