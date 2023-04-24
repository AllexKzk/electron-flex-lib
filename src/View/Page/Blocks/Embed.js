import {Box, Typography} from "@mui/material";

export default function Embed(props){
    return (
      <Box>
        {
          props.supported ? 
          <iframe src ={props.src} style={{height: '190px', width: '100%', maxWidth: '100%', border: 0}} /> 
          : 
          <Typography align="center" sx={{color: 'action.hover'}}>EMBED DOESNT SUPPORTED (◡_◡)</Typography>
        }
      </Box>
    );
}