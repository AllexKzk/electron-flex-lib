import {useLocation} from 'react-router-dom';
import React, {useEffect, useState} from "react";
import {viewtify} from "./fileWorker";
import { Container, Box} from "@mui/material";
import Overlay from "./Overlay";
export default function Page() {
    const [data, setData] = useState(null);
    const location = useLocation();
    const  src = ['lib/'].concat(location.state.src);
    useEffect(() => {
        window.electron.getFile(src, location.state.file, 'utf8', setData);
    }, []);
    return (
        <>
            <Overlay path={location.state.src}/>
            {data &&
                <Container>
                    <Box>
                        {viewtify(data)}
                    </Box>
                </Container>
            }
        </>
    );
}