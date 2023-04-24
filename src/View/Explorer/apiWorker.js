export async function sendRequest(postUrl, pathToSave) {
    const re = /^(?:http:\/\/|www\.|https:\/\/|)([^.]+)/img;
    const site = re.exec(postUrl)[1]; //get site name from user url

    const supportedSites = {
        kknights: 'https://kknights.com/api/v1/post/' + postUrl.split('/').pop() + '/',
        dtf: 'https://api.dtf.ru/v1.9/locate?' + new URLSearchParams({url: postUrl})
    }

    if (!supportedSites.hasOwnProperty(site))
        return false;

    window.electron.receiveData(pathToSave, site);
    window.electron.sendRequestFromServer(supportedSites[site]);
    return true;
}