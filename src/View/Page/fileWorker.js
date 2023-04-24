import {Divider, Typography, Container} from "@mui/material";
import Gallery from "./Blocks/Gallery";
import Embed from "./Blocks/Embed";
import Quote from "./Blocks/Quote";
import Paragraph from "./Blocks/Paragraph";

export function viewtify(json) {
    let viewElement = [];
    if (!json.sign || json.sign !== 'fl-sign' ) //use hash-sum
        return [<Typography> {'Файл повреждён или создан не системой FlexLib :<'} </Typography>];
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