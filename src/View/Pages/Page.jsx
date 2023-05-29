import {useLocation} from 'react-router-dom';
import React, {useEffect, useState} from "react";
import {Container} from "@mui/material";
import Post from '../Components/Post/postProcessor.jsx';
import Overlay from "../Components/Post/Overlay.jsx";

//Post page:
export default function Page() {
    const [postContent, setPostContent] = useState(null);
    const location = useLocation();
    const src = ['lib/'].concat(location.state.src);

    const [fontSize, setSize] = useState(parseInt(localStorage.getItem('fontSize')) || 20);

    useEffect(() => {
        window.electron.getFile(src, location.state.file, 'utf8', setPostContent);
        localStorage.setItem('fontSize', fontSize);
    }, []);

    //handle resize font:
    const handleKey = (e) => {
        if (fontSize && e.ctrlKey){                 //if key pressed with ctrl
            switch(e.key){
                case '=':
                    setSize(fontSize + 1);
                    break;
                case '-':
                    setSize(fontSize - 1);
                    break;
            }
        }
    };
    useEffect(() => {
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [fontSize]);

    return (
        <>
            {postContent &&
                <>
                    <Overlay path={location.state.src} source={postContent.postName}/>
                    <Container sx={{fontSize: `${fontSize}px`, paddingBottom: 2}}>
                        <Post json={postContent} />
                    </Container>
                </>
            }
        </>
    );
}