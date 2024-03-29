import { checkHash, hashString } from "./interfaces/controller";
import {interfaces} from "./interfaces/interfaces";
const { contextBridge, ipcRenderer } = require('electron');
const fs = require("fs");
const path = require("path");
const { exec, spawn } = require('child_process');
require('dotenv').config();
let alertHandler = null;

function pathArrayToString(array) {
    let endPath = '';
    for (let folder of array) {
        endPath = path.join(endPath, folder)
    }
    return endPath;
}

function getFolders(root) {
    const lib = path.join(`./lib`, pathArrayToString(root));
    
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

async function sendRequestFromServer(url, pathToSave, site, loadParams) {
    ipcRenderer.on('getRes', (event, args) => savePost(args, pathToSave, site, url, loadParams));   //set response handler
    ipcRenderer.send('sendReq', {url: url});                                            //send request
}

async function savePost(json, folder, site, url, loadParams) {
    ipcRenderer.removeAllListeners('getRes');                                           //remove response handler

    //json -> API interface -> unified json for EFL 
    interfaces[site](json, loadParams).then(unified => { 
        if (unified.criticalError){                                                 
            alertHandler(`Пост не сохранён: ${unified.criticalError} ._.)`, 'error');
            return;                                                                     //without save
        }

        unified.hash = hashString(JSON.stringify(unified.data));               //hash content block
        unified.link = url;                                                    //link to origin
        fs.writeFile(path.join('./lib', pathArrayToString(folder), unified.data.postName + '.json'), JSON.stringify(unified, null, 2), (err) => {
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
        base64: (rawData) => {  //media files
            if (rawData)
                callback(rawData.toString())
        }
    }
    const filePath = path.join(pathArrayToString(src), filename);
    fs.readFile(filePath,  type, function (err, data) {
        if (err){
            if (type == 'utf8') //if we try to open page file
                alertHandler('Файл не открывается *~*', 'error');
            else                //if we try to open media, it can be loading
                setTimeout(() => getFile(src, filename, type, callback), 1000);
        }
        formats[type](data);
    });
}

async function createDir(parent, name){
    if (['.', '/', '\\', '?', '*', ':'].map(char => name.includes(char)).includes(true))    //check name
        alertHandler('Непристойные символы', 'error');
    else                                                                                    //create dir
        fs.mkdir(path.join('./lib', pathArrayToString(parent), name), err => {
            if (err)
                alertHandler(err.message, 'error');
            else
                alertHandler('Папка успешно создана', 'success');
        });
}

async function openSource(folder, postName){
    const dir = postName ? path.join(folder, postName) : folder;

    //change before build:
    if (process.env.PLATFORM === 'win')
        exec(`start %windir%\\explorer.exe "${path.resolve(dir)}"`);
    else if (process.env.PLATFORM === 'linux')
        spawn('open', [path.resolve(dir)]);
    else
        throw new Error('Undefined PLATFORM .env variable: win/linux');
}

async function setAlertHandler(handler) {
    alertHandler = handler;                                                             //preload handler
    ipcRenderer.on('handleAlert', (event, args) => handler(args.message, args.type));   //ipcMain handler
}
function checkDirPath(path) {
    return fs.existsSync(path);
}

function getFolderAutocomplite(root) {
    if (!fs.existsSync(root))
        return [];

    let folders = [];
    fs.readdirSync(root, {withFileTypes: true}).forEach(dirent => {
        if (!dirent.isFile())
            folders.push({label: dirent.name});
    });
    return folders;
}

contextBridge.exposeInMainWorld('electron', {
    getFolders: (root) => getFolders(root),
    getFolderAutocomplite: (root) => getFolderAutocomplite(root),                                                                 //open folder by path: ./lib/ + root
    getFile: async (src, filename, type, callback) => getFile(src, filename, type, callback),                   //get Page json
    sendRequestFromServer: async (url, pathToSave, site, loadParams) => sendRequestFromServer(url, pathToSave, site, loadParams),       //call ipcMain to send request
    createDir: async (path, name) => createDir(path, name),                                                     //create dit with name by path
    openSource: async (folder, postName = undefined) => openSource(folder, postName),                                                       //open folder with sources
    setAlertHandler: async (handler) => setAlertHandler(handler),                                              //callTopHandler
    checkDirPath: (path) => checkDirPath(path)
});