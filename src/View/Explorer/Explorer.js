import {useEffect, useState} from "react";
import {Grid, Box} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import RootBar from "./Components/RootBar";
import RightClickMenu from "./Components/RightClickMenu/RightClickMenu";
import Tab from "./Components/Tab"

export default function Explorer() { 
    const initPath = useLocation().state ? useLocation().state.path : []; //useLocation() - if we came from Page
    const [path, setPath] = useState(initPath);
    const folders = window.electron.getFolders(path); //get folders from Node
    
    const navigate = useNavigate();
    const changeFolder = (newPath) => {
        if ("json" === newPath.split('.').pop())
            navigate('/file', { state: {src: path, file: newPath}}); //go to Page with state
        else
            setPath(path.concat(newPath)); //change folder
    };

    const [contextMenu, setContextMenu] = useState(null); //right click menu
    const handleContextMenu = (event) => {
        event.preventDefault();
        setContextMenu(contextMenu === null ? {mouseX: event.clientX + 2, mouseY: event.clientY - 6} : null);
    };
    const handleCloseMenu = () => {
        setContextMenu(null);
    };

    return (
        <>
            <RootBar setter={setPath} getter={path}/>
            <Box onContextMenu={handleContextMenu} minHeight={'90vh'}>
                <Grid container spacing={2} sx = {{m: 'auto', maxWidth: '100%'}}>
                    {folders.map((folder) => <Tab callback={changeFolder} isJson={folder.isJson} key={folder.name + '_folder_key'} name={folder.name}/>)}
                </Grid>
                <RightClickMenu callMenu={contextMenu} closeMenu={handleCloseMenu} path={path}/>
            </Box>
        </>
    );
}

