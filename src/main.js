const { app, BrowserWindow } = require('electron');
const requests = require('./requests');

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
  requests(mainWindow);
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
