export async function sendRequest(postUrl, pathToSave, updateCallback) {
    const re = /^(?:http:\/\/|www\.|https:\/\/|)([^.]+)/img;
    const site = re.exec(postUrl)[1]; //get site name from user url
    window.electron.receiveData(pathToSave, site, updateCallback);
    sendReqToApi(site, postUrl);
}
async function sendReqToApi(siteName, postUrl) {
    let url = '';
    switch (siteName){
        case 'kknights':
            const postId = postUrl.split('/').pop();
            url = 'https://kknights.com/api/v1/post/' + postId + '/';
            break;
        case 'dtf':
            url = 'https://api.dtf.ru/v1/locate?' + new URLSearchParams({
                url: postUrl
            });
            break;
        default:
            return null;
    }
    window.electron.sendRequestFromServer(url);
}