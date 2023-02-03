import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {Box, IconButton} from "@mui/material";
import {themeContext} from "../Root/themes";
import {useContext} from "react";
import {useNavigate} from "react-router-dom";
export default function Overlay(props) {
    const theme = useContext(themeContext);
    const navigate = useNavigate();
    const backToFolder = () => {
        navigate('/', {
            state: {path: props.path}
        });
    }
    return (
        <Box sx={{display: 'flex', justifyContent: 'space-between', m: '0 5vw 0 5vw'}}>
           <IconButton size={'large'} onClick={backToFolder}>
               <ArrowBackIosIcon />
           </IconButton>
            <Box>
                <IconButton size={'large'} onClick={theme.changeTheme}>
                    {theme.theme.palette.mode === 'dark' ? <Brightness4Icon /> : <Brightness7Icon />}
                </IconButton>
            </Box>
        </Box>
    );
}