import {Divider, Typography, Container} from "@mui/material";
import Gallery from "./Blocks/Gallery";
import Embed from "./Blocks/Embed";
import Quote from "./Blocks/Quote";
import Paragraph from "./Blocks/Paragraph";

export function viewtify(json) {
    let viewElement = [];

    console.log(json, Object.keys(json).length);
    if (!Object.keys(json).length){
        viewElement.push(<Typography> {'Похоже файл повреждён *~*'} </Typography>);
        return viewElement;
    }

    viewElement.push(
        <>
            <Typography variant={'h2'}> {json.title} </Typography>
            <Typography fontStyle={'italic'} >Автор: {json.author}</Typography>
        </>
    );

    const blockTypes = {
        paragraph: (block) => <Paragraph htmlText={block.htmlText} hidden={block.hidden} />,
        gallery: (block) => <Gallery objects={block.media} hidden={block.hidden} />,
        embed: (block) => <Embed src={block.src} supported={block.isSupported} />,
        sideGallery: (block) => <>
                                    <Paragraph htmlText={block.htmlText} hidden={block.hidden} />
                                    <Gallery objects={block.media} hidden={block.hidden} />
                                </>,
        divider: (block) => <Container sx={{m: '2vh 0 2vh 0'}}>
                                <Divider/>
                            </Container>,
        quote: (block) => <Quote quote={block.quoteHTML} cite={block.citeHTML} hidden={block.hidden} />
    }
    json.content.forEach( block => viewElement.push(blockTypes[block.type](block)) );
    return viewElement;
}