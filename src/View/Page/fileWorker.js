import {Divider, Typography, Container} from "@mui/material";
import Gallery from "./Blocks/Gallery";
import Embed from "./Blocks/Embed";
import Quote from "./Blocks/Quote";
import Paragraph from "./Blocks/Paragraph";
import SimpleLink from "./Blocks/SimpleLink";

export function viewtify(json) {
    let viewElement = [];

    if (!json || !Object.keys(json).length){ //if json is void
        viewElement.push(<Typography> {'Похоже файл повреждён *~*'} </Typography>);
        return viewElement;
    }

    //everything other seems to be good
    viewElement.push(
        <>
            <Typography variant={'h2'}> {json?.title} </Typography>
            <Typography fontStyle={'italic'} >Автор: {json.author}</Typography>
        </>
    );

    const blockTypes = {
        paragraph: (block) => <Paragraph htmlText={block.htmlText} hidden={block.hidden} />,
        gallery: (block) => <Gallery objects={block.media} hidden={block.hidden} />,
        embed: (block) => <Embed src={block.src} supported={block.isSupported} url={block?.url} />,
        link : (block) => <SimpleLink link={block.link} hidden={block.hidden}/>,
        sideGallery: (block) => <>
                                    <Paragraph htmlText={block.htmlText} hidden={block.hidden} />
                                    <Gallery objects={block.media} hidden={block.hidden} />
                                </>,
        divider: (block) => <Container sx={{m: '2vh 0 2vh 0'}}>
                                <Divider/>
                            </Container>,
        quote: (block) => <Quote quote={block.quoteHTML} cite={block.citeHTML} hidden={block.hidden} />,
    };
    json.content.forEach( block => viewElement.push(blockTypes[block.type](block)) );
    return viewElement;
}