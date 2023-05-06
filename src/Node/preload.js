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
    ipcRenderer.removeAllListeners('getRes');                                       //remove response handler

    //json -> API interface -> unified json for EFL 
    interfaces[site](json).then(unified => { 
        if (unified.criticalError){                                                 
            alertHandler(`Пост не сохранён: ${unified.criticalError} ._.)`, 'error');
            return;                                                                 //without save
        }

        unified.hash = hashString(JSON.stringify(unified.data));                    //hash content block
        fs.writeFile('./lib' + pathArrayToString(folder) + unified.data.postName + '.json', JSON.stringify(unified), (err) => {
            if (err)
                alertHandler(err.message, 'error');
            else
                alertHandler('Пост сохранён (˵ •̀ ᴗ - ˵ )', 'success');
        });
    });
}

async function getFile(src, filename, type, callback) {
    const formats = {
        utf8: (rawData) => {            //json page files 
            let readyData;
            try {                       //try to parse
                readyData = JSON.parse(rawData);
            } catch(err) {              //catch corrupted json
                readyData = {};
            }
            finally{
                if (readyData?.hash && readyData?.data && checkHash(readyData.hash, readyData.data)) //check args and hash
                    callback(readyData.data)
                else
                    callback({});
            }
        },      
        base64: (rawData) => callback(rawData.toString())   //media files
    }

    fs.readFile('.' + pathArrayToString(src) + filename,  type, function (err, data) {
        if (err){
            if (type == 'utf8') //if we try to open page file
                alertHandler('Файл не открывается *~*', 'error');
            else                //if we try to open media, it can be loading
                setTimeout(() => getFile(src, filename, type, callback), 100);
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
    let oldConfig;
    try {
        oldConfig = JSON.parse(fs.readFileSync('./src/View/Theming/palette.json'));
    } catch(err) {          //catch parse or read err
        oldConfig = {       //set default config
            "light": {
                "mode": "light",
                "primary": {
                    "main": "#ffb300"
                },
                "background": {
                    "card": "rgba(0, 0, 0, 0.07)"
                },
                "action": {
                    "active": "#ffb300",
                    "hover": "rgba(0, 0, 0, 0.15)"
                },
                "text": {
                    "primary": "#000000"
                }
            },
            "dark": {
                "mode": "dark",
                "primary": {
                    "main": "#ffb300"
                },
                "background": {
                    "card": "rgba(255, 255, 255, 0.07)"
                },
                "action": {
                    "active": "#ffb300",
                    "hover": "rgba(255, 255, 255, 0.16)"
                },
                "text": {
                    "primary": "#fff"
                }
            },
            "common": {
                "text": {
                    "size": "23"
                }
            }
        };
    }
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