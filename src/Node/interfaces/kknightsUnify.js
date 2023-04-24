const { ipcRenderer } = require('electron');
import { uniform } from "./uniform";

export default async function kknightsUnify(json) {
    let unified = structuredClone(uniform);

    unified.author = json.user.username;
    unified.title = json.title;
    unified.postName = unified.title.replace(/<*>*\|*\**\.*\?*:*\\*\/*/gm, ''); //cut wrong chars for filesys
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
                    type: img.is_video ? 'video' : 'image',
                    width: img.width,
                    height: img.height,
                    caption: img.caption
                }
            );
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
        paragraph: (block) => unified.content.push({
            type: 'paragraph',
            htmlText: block.json.content,
            hidden: false
        }),
        gallery: (block) => unified.content.push({
            type: 'gallery',
            media: getMediaContent(block.json.images),
            hidden: block.json.is_hidden
        }),
        sideGallery: (block) => unified.content.push({
            type: 'sideGallery',
            media: getMediaContent(block.json.images),
            htmlText: block.json.content,
            hidden: block.json.is_hidden
        }),
        divider: (block) => unified.content.push({
            type: 'divider'
        }),
        embed: (block) => unified.content.push({
            type: 'embed',
            isSupported: kknightsEmbeds.hasOwnProperty(block.json.embed_type),
            src: kknightsEmbeds[block.json.embed_type] + block.json.uid
        }),
        quote: (block) => unified.content.push({
            type: 'quote',
            quoteHTML: block.json.content,
            citeHTML: block.json.cite,
            hidden: false
        }),
    }

    for (let block of json.content){
        console.log(block);
        blockTypes[block.block](block);
    }

    return unified;
}