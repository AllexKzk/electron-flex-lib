import {interfaces} from "./interfaces/interfaces";
const { contextBridge, ipcRenderer } = require('electron');
const fs = require("fs");
const path = require("path");
const { spawn } = require('child_process');
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

async function receiveData(pathToSave, site) {
    ipcRenderer.on("getRes", (event, args) => savePost(args, pathToSave, site));
}

async function savePost(json, folder, site) {
    interfaces[site](json).then(unified => {
        fs.writeFile('./lib' + pathArrayToString(folder) + unified.postName + '.json', JSON.stringify(unified), (err) => {
            if (err) return console.log(err);
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

async function openSource(postName){
    spawn('open', [path.join('./sources', postName)]);
}

async function getSettings() {
    return JSON.parse(fs.readFileSync('./src/View/Theming/palette.json')).common;
}

async function updateSettings(config) {
    const oldConfig = JSON.parse(fs.readFileSync('./src/View/Theming/palette.json'));
    const newConfig = {...oldConfig, common: {...config}};
    fs.writeFile('./src/View/Theming/palette.json', JSON.stringify(newConfig), err => {
        if (err) console.error(err);
    });
}

contextBridge.exposeInMainWorld('electron', {
    getFolders: (root) => getFolders(root),
    getFile: async (src, filename, type, callback) => getFile(src, filename, type, callback),
    sendRequestFromServer: async (url) => sendRequestFromServer(url),
    receiveData: async (pathToSave, site) => receiveData(pathToSave, site),
    createDir: async (path, name) => createDir(path, name),
    openSource: async (postName) => openSource(postName),
    getSettings: () => getSettings(),
    updateSettings: async (config) => updateSettings(config)
});