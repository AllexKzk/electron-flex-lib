import { callTopHandler } from "../../../AlertHandling/HandlersCollection";

export async function sendRequest(postUrl, pathToSave) {
    const reName = /^(?:http:\/\/|www\.|https:\/\/|)([^.]+)/img;        //dns regex
    const site = reName.exec(postUrl)?.[1];                             //site name from url

    const rePostId = /[\w+]\/([A-Za-z0-9_-]*)\/?$/img;                  //post id regex
    const postId = rePostId.exec(postUrl)?.[1];

    if (!postId || !site){                                              //check URL
        callTopHandler('Неверная ссылка >_>', 'error');
        return;
    }

    const supportedSites = {
        kknights: `https://kknights.com/api/v1/post/${postId}`,
        dtf: `https://api.dtf.ru/v1.9/entry/locate?url=${postUrl}`,
        vc: `https://api.vc.ru/v1.9/entry/locate?url=${postUrl}`
    }

    if (!supportedSites.hasOwnProperty(site)){                          //check API
        callTopHandler('API не поддерживается', 'error');
        return;
    }
    
    window.electron.sendRequestFromServer(supportedSites[site], pathToSave, site);
}