const { app, BrowserWindow, ipcMain, net } = require('electron');
const path = require('path');
const Stream = require('stream').Transform;
const fs = require('fs')

if (require('electron-squirrel-startup')) {
	app.quit();
}

let mainWindow;
const createWindow = () => {

  mainWindow = new BrowserWindow({
	width: 800,
	height: 600,
	webPreferences: {
		nodeIntegration: true,
		preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
	},
	icon: './assets/icon.ico'
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.removeMenu();

  mainWindow.webContents.openDevTools({ mode: 'detach' });

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [ "connect-src 'self' https://*;" ]
      },
    });
  });

};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

//REQUESTS:
ipcMain.on('sendReq', async(event, args) => {
	if (!net.online){ //check net connection
		mainWindow.webContents.send("handleAlert", {message: 'Подключение к интернету отсутствует˙◠˙', type: 'error'});
		return ;
	}

  	const request = net.request(args.url); //send req
	request.on('response', response => { //process response

		response.on('error', (error) => mainWindow.webContents.send("handleAlert", {message: JSON.stringify(error), type: 'error'}));

		let buffers = [];																								//collect data
		response.on('data', (chunk) => buffers.push(chunk));															//by chuncks
		response.on('end', () => mainWindow.webContents.send("getRes", JSON.parse(Buffer.concat(buffers).toString())));	//concat and send
  	});
  	request.end();
});

ipcMain.on('saveMedia', async (event, args) => {
	if (!net.online){
		mainWindow.webContents.send("handleAlert", {message: 'Подключение к интернету отсутствует˙◠˙', type: 'error'});
		return ;
	}

	const request = net.request(args.url);
	request.on('response', response => {
		response.on('error', (error) => mainWindow.webContents.send("handleAlert", {message: JSON.stringify(error), type: 'error'}));

		let data = new Stream();
		response.on('data', (chunk) => data.push(chunk));
		response.on('end', () => {
			const srcDir = path.join('./sources', args.dir);					
			fs.mkdir(srcDir, { recursive: true }, err => { 									//create source dir
				if (err)
					mainWindow.webContents.send("handleAlert", {message: JSON.stringify(err), type: 'error'});
				else
					fs.writeFile(path.join(srcDir, args.filename), data.read(), err => { 	//write source file
						if (err)
							mainWindow.webContents.send("handleAlert", {message: JSON.stringify(err), type: 'error'});
					});
			});
		})
	});
	request.end();
});