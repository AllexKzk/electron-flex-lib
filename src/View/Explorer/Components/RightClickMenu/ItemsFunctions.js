import { sendRequest } from "./apiWorker";

export async function getPage(url, path, resCallback) {
    sendRequest(url, path, resCallback);
}

export async function addFolder(name, path, resCallback) {
    window.electron.createDir(path, name, resCallback);
}

