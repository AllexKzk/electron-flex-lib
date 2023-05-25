import { Button } from "@mui/material";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function Spoiler(props){
    
    return(
        <Button sx={{bgcolor: 'background.card', width: '100%', position: 'relative'}} onClick={props.openSpoiler}>
            <VisibilityOffIcon/>
        </Button> 
    );
}