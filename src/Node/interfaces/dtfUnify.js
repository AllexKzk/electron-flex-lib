const { ipcRenderer } = require('electron'),
showdown  = require('showdown');
import { uniform } from "./uniform";

export default async function dtfUnify(json) {
    let unified = structuredClone(uniform);
    const data = json.result.data;

    unified.author = data.author.name;
    unified.title = data.title;
    unified.postName = unified.title.replace(/<*>*\|*\**\.*\?*:*\\*\/*/gm, ''); //cut wrong chars for filesys

    const dtfPicsSource = 'https://leonardo.osnova.io/'; //dtf media storage
    const dtfAudioSource = 'https://leonardo2.osnova.io/audio/'; //dtf audio storage
    const dtfEmbeds = { //link for supported embeds
        youtube: 'https://www.youtube.com/embed/'
    };

    const getMediaContent = (content) => {
        let media = [];
        const converter = new showdown.Converter();
        const saveDir = unified.postName;
        for (const [index, img] of Object.entries(content)) {
            const type = img.image.data.type === 'gif' ? 'mp4' : img.image.data.type; //gif is lie x_x
            const filename = img.image.data.uuid + '.' + type;
            ipcRenderer.send('saveMedia', {url: dtfPicsSource + img.image.data.uuid, dir: saveDir, filename: filename});
            media.push(
                {
                    src: ['sources', saveDir],
                    filename: filename,
                    type: type === 'mp4' ? 'video' : 'image',
                    caption: converter.makeHtml(img.title)
                }
            );
        }
        return media;
    };

    const getAudioContent = (content) => {
        ipcRenderer.send('saveMedia', {url: dtfAudioSource + content.data.uuid, dir: unified.postName, filename: content.data.filename});
        return[
            {
                src: ['sources', unified.postName],
                filename: content.data.filename,
                type: 'audio',
                caption: ''
            }
        ];
    };

    const dtfTypes = {
        'text': (block) => {
            const converter = new showdown.Converter();
            unified.content.push({
                type: 'paragraph',
                htmlText: converter.makeHtml(block.data.text),
                hidden: block.hidden
            });
        },
        'media': (block) => {
            unified.content.push({
                type: 'gallery',
                media: getMediaContent(block.data.items),
                hidden: block.hidden
            });
        },
        'quote': (block) => {
            unified.content.push({
                type: 'quote',
                quoteHTML: block.data.text,
                citeHTML: block.data.subline1 + " " + block.data.subline2,
                hidden: block.hidden
            });
        },
        'delimiter': (block) => {
            unified.content.push({
                type: 'divider'
            });
        },
        'video': (block) => {
            unified.content.push({
                type: 'embed',
                isSupported: dtfEmbeds.hasOwnProperty(block.data.video.data.external_service.name),
                src: dtfEmbeds[block.data.video.data.external_service.name] + block.data.video.data.external_service.id,
                hidden: block.hidden
            });
        },
        'yamusic': (block) => {
            unified.content.push({
                type: 'embed',
                isSupported: true,
                src: block.data.yamusic.data.box_data.src,
            });
        },
        'spotify': (block) => {
            unified.content.push({
                type: 'embed',
                isSupported: true,
                src: block.data.spotify.data.box_data.src
            });
        }, 
        'link':(block) => {
            unified.content.push({
                type: 'paragraph',
                htmlText:  `<a href="${block.data.link.data.url.split('?')}" target="_blank"> LINK TO:${block.data.link.data.url.split('?')}  </a>`,
                hidden: block.hidden
            });
        },
        'list': (block) => {
            const converter = new showdown.Converter();
            const htmlList =`<${block.data.type}> 
                                ${block.data.items.map(item => `<li>${converter.makeHtml(item)}</li>`).join('')} 
                            </${block.data.type}>`;
            unified.content.push({
                type: 'paragraph',
                htmlText: htmlList,
                hidden: block.hidden
            });
        },
        'incut': (block) => {
            unified.content.push({
                type: 'quote',
                quoteHTML: block.data.text,
                citeHTML: '',
                hidden: block.hidden
            });
        },
        'header': (block) => {
            const html = document.createElement(block.data.style);
            html.innerHTML = block.data.text;
            unified.content.push({
                type: 'paragraph',
                htmlText: html.outerHTML,
                hidden: block.hidden
            });
        },
        'audio': (block) => {
            unified.content.push({
                type: 'gallery',
                media: getAudioContent(block.data.audio),
                hidden: block.hidden
            });
        }
    };

    data.blocks.forEach(block => {
        console.log(block);
        dtfTypes[block.type]?.(block);
    });

    return unified;
}