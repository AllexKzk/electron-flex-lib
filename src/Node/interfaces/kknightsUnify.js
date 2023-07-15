const { ipcRenderer } = require('electron');
import uniform from "./uniform.json";
import path from "path";

export default async function kknightsUnify(json, loadParams) {
    let unified = structuredClone(uniform);
    let unifiedData = unified.data;

    unifiedData.author = json.user.username;
    unifiedData.title = json.title;
    unifiedData.postName = unifiedData.title.replace(/<*>*\|*\**\.*\?*:*\\*\/*/gm, ''); //cut wrong chars for filesys
    unifiedData.content = [];

    const getMediaContent = (content) => {
        let media = [];
        for (let img of content) {
            const saveDir = path.join(loadParams.sourceFolder, unifiedData.postName);
            const filename = img.url.split('/').pop();
            ipcRenderer.send('saveMedia', {url: img.url, dir: saveDir, filename: filename});
            if (!img.is_video || loadParams.isDownloadMedia) {
                media.push(
                    {
                        src: [saveDir],
                        filename: filename,
                        type: img.is_video ? 'video' : 'image',
                        width: img.width,
                        height: img.height,
                        caption: img.caption
                    }
                );
            }
        }
        return media;
    }

    const kknightsEmbeds = {
        steam: 'https://store.steampowered.com/widget/',
        ya_music: 'https://music.yandex.ru/iframe/#track/',
        ya_music_playlist: 'https://music.yandex.ru/iframe/#playlist/',
        youtube: 'https://www.youtube.com/embed/',
        youtube_playlist: 'https://www.youtube.com/embed?listType=playlist&list=',
        spotify: 'https://open.spotify.com/embed/track/',
        spotify_playlist: 'https://open.spotify.com/embed/'
    };

    const blockTypes = {
        paragraph: (block) => unifiedData.content.push({
            type: 'paragraph',
            htmlText: block.json.content,
            hidden: false
        }),
        gallery: (block) => unifiedData.content.push({
            type: 'gallery',
            media: getMediaContent(block.json.images),
            hidden: block.json.is_hidden
        }),
        sideGallery: (block) => unifiedData.content.push({
            type: 'sideGallery',
            media: getMediaContent(block.json.images),
            htmlText: block.json.content,
            hidden: block.json.is_hidden
        }),
        divider: (block) => unifiedData.content.push({
            type: 'divider'
        }),
        embed: (block) => unifiedData.content.push({
            type: 'embed',
            isSupported: kknightsEmbeds.hasOwnProperty(block.json.embed_type),
            url: block.json.url,
            src: kknightsEmbeds[block.json.embed_type] + block.json.uid
        }),
        quote: (block) => unifiedData.content.push({
            type: 'quote',
            quoteHTML: block.json.content,
            citeHTML: block.json.cite,
            hidden: false
        }),
        raw: (block) => unifiedData.content.push({
            rawBlock: block
        }),
    }

    json.content.forEach(block => {
        blockTypes[blockTypes.hasOwnProperty(block.block) ? block.block : 'raw'](block);
    });

    return unified;
}