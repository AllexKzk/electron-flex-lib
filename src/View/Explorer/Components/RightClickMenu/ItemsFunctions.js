import { sendRequest } from "../../apiWorker";

export function getPage(url, path, alertSetter) {
    return new Promise((res, rej)=>{
        res(sendRequest(url, path) 
            .then(isValid => {
                if (isValid)
                    return true;
                alertSetter('Неподдерживаемое API');
                return false;
            })
        );
    });
};

export function addFolder(name, path, alertSetter) {
    //check folder name:
    if (['.', '/', '\\', '?', '*', ':'].map(char => name.includes(char)).includes(true) || name === 'con'){
        alertSetter('Неверное имя файла');
        return false;
    }
    window.electron.createDir(path, name);
    return true;
}

