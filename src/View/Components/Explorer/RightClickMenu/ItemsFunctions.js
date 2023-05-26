import { sendRequest } from "./apiWorker";

export async function getPage(url, path) {
    sendRequest(url, path);
}

export async function addFolder(name, path) {
    window.electron.createDir(path, name);
}