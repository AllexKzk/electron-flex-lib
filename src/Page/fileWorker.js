import {Divider, Typography} from "@mui/material";
import Gallery from "./Gallery";
import Embed from "./Embed";
import Quote from "./Quote";

export function viewtify(json) {
    let viewElement = [];
    if (!json.sign || json.sign !== 'fl-sign' )
        return [<Typography> {'Файл повреждён или создан не системой FlexLib :<'} </Typography>];
    viewElement.push(
        <>
            <Typography variant={'h2'}> {json.title} </Typography>
            <Typography fontStyle={'italic'} >Автор: {json.author}</Typography>
        </>
    )

    for (let block of json.content) {
        switch (block.type){
            case 'paragraph':
                viewElement.push(<Typography dangerouslySetInnerHTML={{__html: block.htmlText}} />);
                break;
            case 'gallery':
                viewElement.push(
                    <Gallery objects={block.media} />
                );
                break;
            case 'embed':
                viewElement.push(
                    <Embed uid={block.uid} source={block.source}/>
                );
                break;
            case 'sideGallery':
                viewElement.push(
                    <>
                        <Typography dangerouslySetInnerHTML={{__html: block.htmlText}} />
                        <Gallery objects={block.media} />
                    </>
                );
                break;
            case 'divider':
                viewElement.push(
                  <Divider/>
                );
                break;
            case 'quote':
                viewElement.push(
                  <Quote quote={block.quoteHTML} cite={block.citeHTML} />
                );
        }
    }
    return viewElement;
}