import {Container, Typography} from "@mui/material";
import { useState } from "react";
import Spoiler from "./Spoiler";

export default function Quote(props){
  const [spoiler, setSpoiler] = useState(props.hidden);

  return (
    <Container>
      {
        spoiler ? 
        <Spoiler openSpoiler={() => setSpoiler(false)}/>
        : 
        <Container variant={'quote'}>
          <Typography variant={'h5'} m={1} dangerouslySetInnerHTML={{__html: props.quote}} />
          <Typography variant={'body2'} sx={{textAlign: 'right', lineHeight: 0}} dangerouslySetInnerHTML={{__html: props.cite}} />
        </Container>
      }
        
    </Container>
  );
}