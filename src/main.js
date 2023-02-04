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

ipcMain.on('sendReq', async(event, args) => {
  const url = args.url;
  const request = net.request(url);

  request.on('response', response => {
    let buffers = [];
    response.on('end', () => {
      mainWindow.webContents.send("getRes", JSON.parse(Buffer.concat(buffers).toString()));
    });
    response.on('data', (chunk) => {
      buffers.push(chunk);
    });
  });
  request.end();
});

ipcMain.on('saveMedia', async (event, args) => {
  const request = net.request(args.url);
  request.on('response', response => {
    let data = new Stream();

    response.on('end', () => {
      const srcDir = path.join('./sources', args.dir);
      fs.mkdir(srcDir, { recursive: true }, (err) => {
        if (err) console.log(err);
      });
      fs.writeFileSync(srcDir + args.filename, data.read());
    });
    response.on('data', (chunk) => {
      data.push(chunk);
    });
  });
  request.end();
});