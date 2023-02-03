const { contextBridge, ipcRenderer } = require('electron');
const fs = require("fs");
const path = require("path");
import {interfaces} from "./interfaces";
function pathArrayToString(array) {
    let path = '/';
    for (let folder of array) {
        path += folder + '/';
    }
    return path;
}

function getFolders(root) {
    const lib = path.resolve('./lib' + pathArrayToString(root));
    if (!fs.existsSync(lib)){
        console.log('create dir: ' + lib);
        fs.mkdirSync(lib);
    }
    let folders = [];
    fs.readdirSync(lib).forEach(function(file) {
        folders.push({
            name: file,
            isJson: path.extname(path.join(lib, file)) === '.json'
        });
    });
    return folders;
}

async function sendRequestFromServer(url) {
    ipcRenderer.send('sendReq', {url: url});
}

async function receiveData(pathToSave, site, updateCallback) {
    ipcRenderer.on("getRes", (event, args) => savePost(args, pathToSave, site, updateCallback));
}

async function savePost(json, folder, site, updateCallback) {
    interfaces[site](json).then(unified => {
        fs.writeFile('./lib' + pathArrayToString(folder) + unified.postName + '.json', JSON.stringify(unified), (err) => {
            if (err) return console.log(err);
            updateCallback();
        });
    });
}

async function getFile(src, filename, type, callback) {
    fs.readFile('.' + pathArrayToString(src) + filename,  type, function (err, data) {
        if (err)
            setTimeout(() => getFile(src, filename, type, callback), 100);
        else {
            switch (type){
                case 'utf8': callback(JSON.parse(data.toString())); break;
                case 'base64': callback(data.toString()); break;
            }
        }
    });
}


async function createDir(path, name){
    fs.mkdir('./lib' + pathArrayToString(path) + name, err => {
        if (err) return console.log(err);
    });
}


contextBridge.exposeInMainWorld('electron', {
    getFolders: (root) => getFolders(root),
    getFile: async (src, filename, type, callback) => getFile(src, filename, type, callback),
    sendRequestFromServer: async (url) => sendRequestFromServer(url),
    receiveData: async (pathToSave, site, updateCallback) => receiveData(pathToSave, site, updateCallback),
    createDir: async (path, name) => createDir(path, name),
});