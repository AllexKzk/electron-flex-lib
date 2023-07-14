import { callTopHandler } from "../../../AlertHandling/HandlersCollection";

export async function sendRequest(postUrl, pathToSave) {
    const reName = /^(?:http:\/\/|www\.|https:\/\/|)([^.]+)/img;        //dns regex
    const site = reName.exec(postUrl)?.[1];                             //site name from url

    const supportedSites = {
        kknights: {
            urlRegex: /[\w+]\/([A-Za-z0-9_-]*)\/?$/img,
            urlApi: 'https://kknights.com/api/v1/post/'
        },
        dtf: {
            urlRegex: /[\w+]\/([0-9]*)\-([A-z0-9-?=]*)$/img,
            urlApi: 'https://api.dtf.ru/v2.1/content?id='
        },
        vc: {
            urlRegex: /[\w+]\/([0-9]*)\-([A-z0-9-?=]*)$/img,
            urlApi: 'https://api.dtf.ru/v2.1/content?id='
        }
    }

    if (!site) {
        callTopHandler('Неверная ссылка >_>', 'error');
        return;
    }
    else if (!supportedSites.hasOwnProperty(site)) {
        callTopHandler('API не поддерживается', 'error');
        return;
    }

    const contentId = supportedSites[site].urlRegex.exec(postUrl)?.[1];
    if (!contentId) {
        callTopHandler('Не удалось получить id статьи v_v', 'error');
        return;
    }
    const endpoint = supportedSites[site].urlApi + contentId;
    window.electron.sendRequestFromServer(endpoint, pathToSave, site, {
        isDownloadMedia: localStorage.getItem('isDownloadMedia') === 'true',
    });
}