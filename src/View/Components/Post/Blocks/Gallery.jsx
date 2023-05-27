import {Box, Container, IconButton, Typography, CircularProgress} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Spoiler from "./Spoiler.jsx";

export default function Gallery(props){
    const [index, setIndex] = useState(0);                      //index of media arr
    const [buf, setBuf] = useState('');                         //current media content
    const [spoiler, setSpoiler] = useState(props.hidden);

    const getMediaFromServer = (buffer) => {
        let type = props.objects[index].type + '/';
        const src = 'data:' + type + props.objects[index].filename.split('.').pop()  + ';base64,' + buffer;
        setBuf(src);
    };
    
    const tag = {
        'video': <video src={buf} 
                    style={{height: 'inherit', maxHeight: '50vh', maxWidth: '100%', width: 'auto'}}
                    controls={true} />,

        'image': <img src={buf} 
                    style={{height: 'inherit', maxHeight: '50vh', maxWidth: '100%', width: 'auto'}}/>,

        'audio': <audio src={buf} style={{width: '100%'}}
                    controls={true}/>
    }

    //observer: load content only when Gallery in view 
    const galleryBlock = useRef();
    const [isVisible, setVisibility] = useState(false);
    const observerCall = (entries) => {
        const [enrty] = entries;
        if (enrty.isIntersecting)
            setVisibility(true)
    };

    useEffect(() => {
        const observer = new IntersectionObserver(observerCall, {
            root: null,
            rootMargin: '20px',
            threshold: 0.1
        });
        if (galleryBlock.current)
            observer.observe(galleryBlock.current);
        return () => {
            if (galleryBlock.current)
                observer.unobserve(galleryBlock.current);
        }
    }, [galleryBlock]);

    useEffect(() => {
        if (isVisible)
            window.electron.getFile(props.objects[index].src, props.objects[index].filename, 'base64', getMediaFromServer);
    }, [index, isVisible]);

    return (
        <div ref={galleryBlock}>
        {
            spoiler ? 
            <Spoiler openSpoiler={() => setSpoiler(false)}/>
            : 
            <>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="inherit"
                >
                    {
                        buf.length ? tag[props.objects[index].type] :
                            <Box w={'640px'} h={'640px'}>
                                <CircularProgress />
                            </Box>
                    }
                </Box>
                {
                    props.objects[index].caption &&
                    <Typography align={'center'} dangerouslySetInnerHTML={{__html: props.objects[index].caption}}/>
                }
                {
                    props.objects.length > 1 &&
                    <Box display="flex"
                        justifyContent="center"
                        alignItems="center"
                        width="inherit">
                        <IconButton onClick={() => setIndex(index-1)} disabled={!props.objects[index - 1]}>
                            <ArrowBackIosIcon />
                        </IconButton>
                        <IconButton onClick={() => setIndex(index+1)} disabled={!props.objects[index + 1]}>
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Box>
                }
            </>
        }
        </div>
    );
}
