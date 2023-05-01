import { sendRequest } from "./apiWorker";

export async function getPage(url, path) {
    sendRequest(url, path);
}

export async function addFolder(name, path, resCallback) {
    window.electron.createDir(path, name, resCallback);
}

