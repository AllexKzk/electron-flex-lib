import {useLocation} from 'react-router-dom';
import React, {useEffect, useState} from "react";
import {Box, Container, Snackbar} from "@mui/material";
import Post from '../Components/Post/postProcessor.jsx';
import Overlay from "../Components/Post/Overlay.jsx";

//Post page:
export default function Page() {
    const [postContent, setPostContent] = useState(null);
    const location = useLocation();
    const src = ['lib/'].concat(location.state.src);

    const [fontSize, setSize] = useState(parseInt(localStorage.getItem('fontSize')) || 20);
    const [isOpened, setSnack] = useState(false);

    useEffect(() => {
        window.electron.getFile(src, location.state.file, 'utf8', setPostContent);
        localStorage.setItem('fontSize', fontSize);
    }, []);

    //handle resize font:
    const handleKey = (e) => {
        if (fontSize && e.ctrlKey){                 //if key pressed with ctrl
            switch(e.key) {
                case '=':
                    setSize(fontSize + 1);
                    break;
                case '-':
                    setSize(fontSize - 1);
                    break;
            }
            setSnack(true);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return;
        setSnack(false);
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [fontSize]);

    return (
        <Box sx={{backgroundColor: 'background.context-page'}}>
            {postContent &&
                <Box>
                    <Snackbar
                        open={isOpened}
                        autoHideDuration={1000}
                        onClose={handleClose}
                        message={`${fontSize}px`}
                    />
                    <Overlay path={location.state.src} source={postContent.postName}/>
                    <Container
                        sx={{fontSize: `${fontSize}px`, paddingBottom: 2, backgroundColor: 'background.main-page'}}
                    >
                        <Post json={postContent} />
                    </Container>
                </Box>
            }
        </Box>
    );
}