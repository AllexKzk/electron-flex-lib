import {Box, Typography} from "@mui/material";
import { useState } from "react";
import Spoiler from "./Spoiler.jsx";

export default function Quote(props){
  const [spoiler, setSpoiler] = useState(props.hidden);

  return (
    <Box>
      {
        spoiler ? 
        <Spoiler openSpoiler={() => setSpoiler(false)}/>
        : 
        <Box variant={'quote'}>
          <Typography variant={'h5'} dangerouslySetInnerHTML={{__html: props.quote}} />
          <Typography variant={'body2'} sx={{textAlign: 'right', lineHeight: 0}} dangerouslySetInnerHTML={{__html: props.cite}} />
        </Box>
      }
    </Box>
  );
}