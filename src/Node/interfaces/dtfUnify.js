const { ipcRenderer } = require('electron'),
showdown  = require('showdown');
import uniform from "./uniform.json";
import path from "path";

export default async function dtfUnify(json, loadParams) {
    let unified = structuredClone(uniform);
    let unifiedData = unified.data;
    const data = json.result;

    unifiedData.author = data.author.name;
    unifiedData.title = data.title.length ? data.title : 'untitled';
    unifiedData.postName =`${unifiedData.title.replace(/<*>*\|*\**\.*\?*:*\\*\/*/gm, '')}`; //cut wrong chars for filesys

    const dtfPicsSource = 'https://leonardo.osnova.io/';                        //dtf media storage
    const dtfAudioSource = 'https://leonardo2.osnova.io/audio/';                //dtf audio storage
    const dtfEmbeds = {                                                         //link for supported embeds
        youtube: 'https://www.youtube.com/embed/'
    };

    const getMediaContent = (content) => {
        let media = [];
        const converter = new showdown.Converter();
        const saveDir = path.join(loadParams.sourceFolder, unifiedData.postName);
        for (const [index, img] of Object.entries(content)) {
            const type = img.image.data.type === 'gif' ? 'mp4' : img.image.data.type; //gif is lie x_x
            const filename = img.image.data.uuid + '.' + type;
            ipcRenderer.send('saveMedia', {url: dtfPicsSource + img.image.data.uuid, dir: saveDir, filename: filename});
            media.push(
                {
                    src: [saveDir],
                    filename: filename,
                    type: type === 'mp4' ? 'video' : 'image',
                    caption: converter.makeHtml(img.title)
                }
            );
        }
        return media;
    };

    const getAudioContent = (content) => {
        const saveDir = path.join(loadParams.sourceFolder, unifiedData.postName);
        ipcRenderer.send('saveMedia', {
            url: dtfAudioSource + content.data.uuid, 
            dir: saveDir, 
            filename: content.data.filename
        });
        return[
            {
                src: [saveDir],
                filename: content.data.filename,
                type: 'audio',
                caption: ''
            }
        ];
    };

    const dtfTypes = {
        'text': (block) => {
            const converter = new showdown.Converter();
            unifiedData.content.push({
                type: 'paragraph',
                htmlText: converter.makeHtml(block.data.text),
                hidden: block.hidden
            });
        },
        'media': (block) => {
            if (loadParams.isDownloadMedia) {
                unifiedData.content.push({
                    type: 'gallery',
                    media: getMediaContent(block.data.items),
                    hidden: block.hidden
                });
            }
        },
        'quote': (block) => {
            unifiedData.content.push({
                type: 'quote',
                quoteHTML: block.data.text,
                citeHTML: block.data.subline1 + " " + block.data.subline2,
                hidden: block.hidden
            });
        },
        'delimiter': (block) => {
            unifiedData.content.push({
                type: 'divider'
            });
        },
        'video': (block) => {
            unifiedData.content.push({
                type: 'embed',
                isSupported: dtfEmbeds.hasOwnProperty(block.data.video.data.external_service.name),
                src: dtfEmbeds[block.data.video.data.external_service.name] + block.data.video.data.external_service.id,
                hidden: block.hidden
            });
        },
        'yamusic': (block) => {
            unifiedData.content.push({
                type: 'embed',
                isSupported: true,
                src: block.data.yamusic.data.box_data.src,
            });
        },
        'spotify': (block) => {
            unifiedData.content.push({
                type: 'embed',
                isSupported: true,
                src: block.data.spotify.data.box_data.src
            });
        }, 
        'link':(block) => {
            unifiedData.content.push({
                type: 'link',
                link: block.data.link.data.url.split('?')[0],
                hidden: block.hidden
            });
        },
        'list': (block) => {
            const converter = new showdown.Converter();
            const htmlList =`<${block.data.type}> 
                                ${block.data.items.map(item => `<li>${converter.makeHtml(item)}</li>`).join('')} 
                            </${block.data.type}>`;
            unifiedData.content.push({
                type: 'paragraph',
                htmlText: htmlList,
                hidden: block.hidden
            });
        },
        'incut': (block) => {
            unifiedData.content.push({
                type: 'quote',
                quoteHTML: block.data.text,
                citeHTML: '',
                hidden: block.hidden
            });
        },
        'header': (block) => {
            const html = document.createElement(block.data.style);
            html.innerHTML = block.data.text;
            unifiedData.content.push({
                type: 'paragraph',
                htmlText: html.outerHTML,
                hidden: block.hidden
            });
        },
        'audio': (block) => {
            if (loadParams.isDownloadMedia) {
                unifiedData.content.push({
                    type: 'gallery',
                    media: getAudioContent(block.data.audio),
                    hidden: block.hidden
                });
            }
        },
        'raw': (block) => {
            unifiedData.content.push({
                rawBlock: block
            });
        }
    };

    data.blocks.forEach(block => {
        dtfTypes[dtfTypes.hasOwnProperty(block.type) ? block.type : 'raw'](block);
    });

    return unified;
}