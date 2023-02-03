import {Box, Typography} from "@mui/material";

export default function Quote(props){
    return (
      <Box sx={{ flexDirection: 'column', borderLeft: 'solid', fontStyle: 'italic' }}>
          <Typography variant={'h5'} m={1} dangerouslySetInnerHTML={{__html: props.quote}} />
          <Typography variant={'body2'} sx={{ textAlign: 'right', lineHeight: 0}} dangerouslySetInnerHTML={{__html: props.cite}} />
      </Box>
    );
}