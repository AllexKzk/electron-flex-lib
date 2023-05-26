import {useLocation} from 'react-router-dom';
import React, {useEffect, useState} from "react";
import {viewtify} from "../Components/Post/postProcessor.jsx";
import {Container, Box, Paper, Typography} from "@mui/material";
import Overlay from "../Components/Post/Overlay.jsx";

export default function Page() {
    const [data, setData] = useState(null);
    const location = useLocation();
    const  src = ['lib/'].concat(location.state.src);

    const [fontSize, setSize] = useState(parseInt(localStorage.getItem('fontSize')) || 20);

    useEffect(() => {
        window.electron.getFile(src, location.state.file, 'utf8', setData);
        document.addEventListener('keydown', handleKey); //handle resize font

        localStorage.setItem('fontSize', fontSize); //store locally
        return () => {
            document.removeEventListener('keydown', handleKey);
        };
    }, [fontSize]);

    const handleKey = (e) => {
        if (fontSize && e.ctrlKey){ //if ctrl pressed
            switch(e.key){
                case '=':
                    setSize(fontSize + 1);
                    break;
                case '-':
                    setSize(fontSize - 1);
                    break;
            }
        }
    }

    return (
        <>
            {data &&
                <>
                    <Overlay path={location.state.src} source={data.postName}/>
                    <Container sx={{fontSize: `${fontSize}px`, paddingBottom: 2}}>
                        {
                            viewtify(data).map( (block) =>  <Box m={2}>
                                                                {block}
                                                            </Box>)
                        }
                    </Container>
                </>
            }
        </>
    );
}