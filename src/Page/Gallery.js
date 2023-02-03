import {Box, Container, IconButton, Typography, CircularProgress} from "@mui/material";
import {useEffect, useState} from "react";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function Gallery(props){
    const [index, setIndex] = useState(0);
    const [buf, setBuf] = useState('');
    const getMediaFromServer = (buffer) => {
        let type = props.objects[index].is_video ? 'video/' : 'image/';
        const src = 'data:' + type + props.objects[index].filename.split('.').pop()  + ';base64,' + buffer;
        setBuf(src);
    };
    useEffect(() => {
        window.electron.getFile(props.objects[index].src, props.objects[index].filename, 'base64', getMediaFromServer);
    }, [index]);

    const content = props.objects[index].is_video ?
        <video src={buf}
               style={{height: 'inherit', maxHeight: '50vh'}}
               controls={true} /> :
        <img src={buf}
             style={{height: 'inherit', maxHeight: '50vh', maxWidth: '100%'}} />

    return (
        <Container sx={{m: '2vh 0 2vh 0'}}>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="inherit"
            >
                {
                    buf.length ? content :
                        <Box w={'640px'} h={'640px'}>
                            <CircularProgress />
                        </Box>
                }
            </Box>
            {
                props.objects[index].caption &&
                <Typography align={'center'}> {props.objects[index].caption} </Typography>
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
        </Container>
    );
}
