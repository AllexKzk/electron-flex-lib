import Spoiler from "./Spoiler.jsx";
import {useState} from "react";
import {Box, Button} from "@mui/material";

export default function SimpleLink(props) {
    const [spoiler, setSpoiler] = useState(props.hidden);
    
    return (
        spoiler ? 
        <Spoiler openSpoiler={() => setSpoiler(false)}/>
        : 
        <Box sx={{width: '100%', display: 'flex', justifyContent: 'center'}}>
            <Button variant="outlined" href={props.link} target="_blink">
                LINK
            </Button>
        </Box>
    );
}