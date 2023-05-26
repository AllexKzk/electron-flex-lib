import { Box, Typography } from "@mui/material";
import { useState } from "react";
import Spoiler from "./Spoiler.jsx";

export default function Paragraph(props) {
    const [spoiler, setSpoiler] = useState(props.hidden);

    return (
        <Box>
            {
                spoiler ? 
                <Spoiler openSpoiler={() => setSpoiler(false)}/>
                : 
                <Typography fontSize="inherit" dangerouslySetInnerHTML={{__html: props.htmlText}} />
            }
        </Box>
    );
}