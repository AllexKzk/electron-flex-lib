import {Container, Typography} from "@mui/material";
import {useState} from "react";
import Spoiler from "./Spoiler.jsx";

export default function Quote(props){
  const [spoiler, setSpoiler] = useState(props.hidden);

  return (
    <>
      {
        spoiler ? 
        <Spoiler openSpoiler={() => setSpoiler(false)}/>
        : 
        <Container variant={'quote'}>
          <Typography variant={'h5'} dangerouslySetInnerHTML={{__html: props.quote}} />
          <Typography variant={'body2'} sx={{textAlign: 'right'}} dangerouslySetInnerHTML={{__html: props.cite}} />
        </Container>
      }
    </>
  );
}