import path from "path";

const { ipcRenderer } = require('electron');
export const interfaces = {
  kknights: async (data) => await kknightsUnify(data)
};

const uniform = {
    sign: 'fl-sign',
    author: '',
    title: '',
    postName: '',
    content: []
};

async function kknightsUnify(json) {
    let unified = structuredClone(uniform);
    unified.author = json.user.username;
    unified.title = json.title;
    unified.postName = unified.title.replace(/<*>*\|*\**\.*\?*:*\\*\/*/gm, '');
    unified.content = [];
    const getMediaContent = (content) => {
        let media = [];
        for (let img of content) {
            const saveDir = unified.postName;
            const filename = img.url.split('/').pop();
            ipcRenderer.send('saveMedia', {url: img.url, dir: saveDir, filename: filename});
            media.push(
                {
                    src: ['sources', unified.postName],
                    filename: filename,
                    is_video: img.is_video,
                    width: img.width,
                    height: img.height,
                    caption: img.caption
                }
            );
        }
        return media;
    }

    for (let block of json.content){
        switch(block.block) {
            case 'paragraph':
                unified.content.push({
                    type: 'paragraph',
                    htmlText: block.json.content
                });
                break;
            case 'gallery':
                unified.content.push({
                    type: 'gallery',
                    media: getMediaContent(block.json.images)
                });
                break;
            case 'sideGallery':
                unified.content.push({
                    type: 'sideGallery',
                    media: getMediaContent(block.json.images),
                    htmlText: block.json.content
                });
                break;
            case 'divider':
                unified.content.push({
                    type: 'divider'
                });
                break;
            case 'embed':
                unified.content.push({
                    type: 'embed',
                    source: block.json.embed_type,
                    uid: block.json.uid
                });
                break;
            case 'quote':
                unified.content.push({
                    type: 'quote',
                    quoteHTML: block.json.content,
                    citeHTML: block.json.cite
                });
                break;
        }
    }

    return unified;
}