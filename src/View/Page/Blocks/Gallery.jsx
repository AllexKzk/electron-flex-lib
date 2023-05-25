import {Box, Container, IconButton, Typography, CircularProgress} from "@mui/material";
import {useEffect, useState} from "react";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Spoiler from "./Spoiler.jsx";

export default function Gallery(props){
    const [index, setIndex] = useState(0);
    const [buf, setBuf] = useState('');
    const [spoiler, setSpoiler] = useState(props.hidden);

    const getMediaFromServer = (buffer) => {
        let type = props.objects[index].type + '/';
        const src = 'data:' + type + props.objects[index].filename.split('.').pop()  + ';base64,' + buffer;
        setBuf(src);
    };
    
    useEffect(() => {
        window.electron.getFile(props.objects[index].src, props.objects[index].filename, 'base64', getMediaFromServer);
    }, [index]);

    const tag = {
        'video': <video src={buf}
                    style={{height: 'inherit', maxHeight: '50vh', maxWidth: '100%', width: 'auto'}}
                    controls={true} />,
        'image': <img src={buf}
                    style={{height: 'inherit', maxHeight: '50vh', maxWidth: '100%', width: 'auto'}} />,
        'audio': <audio src={buf} style={{width: '100%'}}
                    controls={true}/>
    }

    return (
        <>
        {
            spoiler ? 
            <Spoiler openSpoiler={() => setSpoiler(false)}/>
            : 
            <Box>
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
            </Box>
        }
        </>
    );
}
