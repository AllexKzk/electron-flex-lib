import { checkHash, hashString } from "./interfaces/controller";
import {interfaces} from "./interfaces/interfaces";
const { contextBridge, ipcRenderer } = require('electron');
const fs = require("fs");
const path = require("path");
const { spawn } = require('child_process');
let alertHandler = null;

function pathArrayToString(array) {
    let path = '/';
    for (let folder of array) {
        path += folder + '/';
    }
    return path;
}

function getFolders(root) {
    const lib = path.resolve('./lib' + pathArrayToString(root));
    if (!fs.existsSync(lib)){                                           //if ./lib doesn't exist
        fs.mkdir(lib, err => {                                          //create it
            if (err)
                alertHandler(err);
        });
    }

    let folders = [];               
    fs.readdirSync(lib, {withFileTypes: true}).forEach(dirent => {
        folders.push({
            name: dirent.name,
            isFile: dirent.isFile()
        });
    });
    return folders;
}

async function sendRequestFromServer(url, pathToSave, site) {
    ipcRenderer.on('getRes', (event, args) => savePost(args, pathToSave, site));    //set response handler
    ipcRenderer.send('sendReq', {url: url});                                        //send request
}

async function savePost(json, folder, site) {
    //json -> API interface -> unified json for EFL 
    interfaces[site](json).then(unified => { 
        unified.hash = hashString(JSON.stringify(unified.content)); //hash content | if it willn't work fast -> rewrite
        fs.writeFile('./lib' + pathArrayToString(folder) + unified.postName + '.json', JSON.stringify(unified), (err) => {
            if (err)
                alertHandler(err.message, 'error');
            else
                alertHandler('Пост сохранён (˵ •̀ ᴗ - ˵ )', 'success');
        });
    });
}

async function getFile(src, filename, type, callback) {
    const formats = {
        utf8: (rawData) => {                                           //json page files 
            const readyData = JSON.parse(rawData);
            if (checkHash(readyData.hash, readyData.content))
                callback(readyData);
            else
                callback({});
        },      
        base64: (rawData) => callback(rawData.toString())                 //media files
    }

    fs.readFile('.' + pathArrayToString(src) + filename,  type, function (err, data) {
        if (err){
            if (type == 'utf8') //if we try to open page file
                alertHandler('Файл не открывается *~*', 'error');
            else                //if we try to open media, it can be loading
                setTimeout(() => getFile(src, filename, type, callback), 100); //CHECK IT
        }
        else
            formats[type](data);
    });
}

async function createDir(path, name){
    if (['.', '/', '\\', '?', '*', ':'].map(char => name.includes(char)).includes(true))    //check name
        alertHandler('Непристойные символы', 'error');
    else                                                                                    //create dir
        fs.mkdir('./lib' + pathArrayToString(path) + name, err => {
            if (err)
                alertHandler(err.message, 'error');
            else
                alertHandler('Папка успешно создана', 'success');                                         
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
        if (err) alertHandler(err.message, 'error');
    });
}

async function setAlertHandler(handler) {
    alertHandler = handler;                                                             //preload handler
    ipcRenderer.on('handleAlert', (event, args) => handler(args.message, args.type));   //ipcMain handler
}

contextBridge.exposeInMainWorld('electron', {
    getFolders: (root) => getFolders(root),                                                                     //open folder by path: ./lib/ + root
    getFile: async (src, filename, type, callback) => getFile(src, filename, type, callback),                   //get Page json
    sendRequestFromServer: async (url, pathToSave, site) => sendRequestFromServer(url, pathToSave, site),       //call ipcMain to send request
    createDir: async (path, name) => createDir(path, name),                                                     //create dit with name by path
    openSource: async (postName) => openSource(postName),                                                       //open folder with sources
    getSettings: () => getSettings(),                                                                           //get palette settings from json
    updateSettings: async (config) => updateSettings(config),                                                   //update settings in json
    setAlertHandler: async (handler) => setAlertHandler(handler)                                                //callTopHandler
});