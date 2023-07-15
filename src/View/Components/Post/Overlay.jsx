import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import {IconButton} from "@mui/material";
import {themeContext} from "../../Theming/themes";
import {useContext, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function Overlay(props) {
    const theme = useContext(themeContext);
    const [scrollYPos, setScrollYPos] = useState(0);
    const blockRef = useRef();

    //all startup's money went to sliding buttons:
    useEffect(() => {
        document.addEventListener('scroll', handleScroll);
        return () => document.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScroll = (e) => {
        const yPos = window.pageYOffset;
        if (yPos >= scrollYPos)     //hide if scroll down
            blockRef.current.style.top = '-50px';
        if (!yPos)                  //show on top
            blockRef.current.style.top = '0';
        setScrollYPos(yPos);
    };

    const navigate = useNavigate();
    const backToFolder = () => {
        navigate('/', {             //return to the Explorer
            state: {path: props.path}
        });
    };
    
    return (
        <div 
            onMouseEnter={() => {blockRef.current.style.top = 0}} 
            onMouseLeave={() => {blockRef.current.style.top = scrollYPos ? '-50px' : '0'}}
            style={{position: 'fixed', top: '0', width: '100%', height: '50px'}}>
                <div ref={blockRef} style={{top: 0, position: 'fixed', width: '100%', transitionDuration: '500ms', display: 'flex', justifyContent: 'space-between'}}>
                    <IconButton size={'large'} onClick={backToFolder}>
                        <ArrowBackIosIcon />
                    </IconButton>
                    <div>
                        <IconButton size={'large'} onClick={theme.changeTheme}>
                            {theme.theme.palette.mode === 'dark' ? <Brightness4Icon /> : <Brightness7Icon />}
                        </IconButton>
                        <IconButton
                            size={'large'}
                            onClick={() => window.electron.openSource(localStorage.getItem('srcDir') || './sources', props.source)}
                        >
                            <FolderOpenIcon/>
                        </IconButton>
                    </div>
                </div>
        </div>
    );
}