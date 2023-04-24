import { Button, Container, Typography } from "@mui/material";
import { useState } from "react";
import Spoiler from "./Spoiler";

export default function Paragraph(props) {
    const [spoiler, setSpoiler] = useState(props.hidden);

    return (
        <Container sx={{m: '2vh 0 2vh 0'}}>
            {
                spoiler ? 
                <Spoiler openSpoiler={() => setSpoiler(false)}/>
                : 
                <Typography variant="pageText" dangerouslySetInnerHTML={{__html: props.htmlText}} />
            }
        </Container>
    );
}