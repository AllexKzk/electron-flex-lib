const { ipcMain, net } = require('electron');
const Stream = require('stream').Transform;
const fs = require('fs');
const path = require('path');

function connectRequests(mainWindow){
    ipcMain.on('sendReq', async(event, args) => {
        if (!net.online){ //check net connection
            mainWindow.webContents.send("handleAlert", {message: 'Подключение к интернету отсутствует˙◠˙', type: 'error'});
            return ;
        }
    
          const request = net.request(args.url); //send req
        request.on('response', response => { //process response
            response.on('error', (error) => mainWindow.webContents.send("handleAlert", {message: JSON.stringify(error), type: 'error'}));
    
            if (response.statusCode == 404)
                mainWindow.webContents.send("handleAlert", {message: 'код 404 ( ͡° ͜ʖ ͡°)', type: 'error'});
    
            if (response.statusCode == 200){
                let buffers = [];																								//collect data
                response.on('data', (chunk) => buffers.push(chunk));															//by chuncks
                response.on('end', () => {
                    let jsonData;
                    try {
                        jsonData = JSON.parse(Buffer.concat(buffers).toString());	//try to concat and parse
                    } catch (err) {
                        ipcRenderer.removeAllListeners('getRes');                   //remove response handler
                        mainWindow.webContents.send("handleAlert", {message: 'Не получилось скачать содержимое T_T', type: 'error'});
                    }
                    mainWindow.webContents.send("getRes", jsonData);				//send resault
                });
            }
            
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
    
            let data = new Stream();							//FIX IT: 404 etc
            response.on('data', (chunk) => data.push(chunk));
            response.on('end', () => {
                const srcDir = path.join('./sources', args.dir);					
                fs.mkdir(srcDir, { recursive: true }, err => { 									//create source dir
                    if (err)
                        mainWindow.webContents.send("handleAlert", {message: JSON.stringify(err), type: 'error'});
                    else
                        fs.writeFile(path.join(srcDir, args.filename), data.read(), err => { 	//write source file
                            if (err) mainWindow.webContents.send("handleAlert", {message: JSON.stringify(err), type: 'error'});
                        });
                });
            })
        });
        request.end();
    });
}

module.exports = connectRequests;