import {useEffect, useState} from "react";
import {Grid, Box, Menu, Card, CardContent, Typography} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import FolderIcon from '@mui/icons-material/Folder';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import RootBar from "./RootBar";
import {AddFolderItem, AddPageItem} from "./MenuItems";
export default function Root() { //current folder
    const initPath = useLocation().state ? useLocation().state.path : []; //useLocation() - if we came from Page
    const [path, setPath] = useState(initPath);
    const folders = window.electron.getFolders(path);
    const navigate = useNavigate();
    const changeFolder = (newPath) => {
        if ("json" === newPath.split('.').pop())
            navigate('/file', { state: {src: path, file: newPath}}); //go to Page with state
        else
            setPath(path.concat(newPath));
    };

    const [contextMenu, setContextMenu] = useState(null); //right click menu
    const handleContextMenu = (event) => {
        event.preventDefault();
        setContextMenu(contextMenu === null ? {mouseX: event.clientX + 2, mouseY: event.clientY - 6} : null);
    };
    const handleClose = () => {
        setContextMenu(null);
    };
    return (
        <>
            <RootBar setter={setPath} getter={path}/>
            <Box onContextMenu={handleContextMenu} height={'100vh'}>
                <Grid container spacing={2} sx = {{m: 'auto', maxWidth: '100%'}}>
                    {folders.map((folder) => <Tab callback={changeFolder} isJson={folder.isJson} key={folder.name + '_folder_key'} name={folder.name}/>)}
                </Grid>
                <Menu open={contextMenu !== null} onClose={handleClose}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        contextMenu !== null
                            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                            : undefined
                    }
                >
                    <AddPageItem path={path} closeMenu={handleClose} updateCallback={() => changeFolder('')} />
                    <AddFolderItem path={path} closeMenu={handleClose} />
                </Menu>
            </Box>
        </>
    );
}

function Tab(props) {
    return (
        <Grid item>
            <Card onClick={() => props.callback(props.name)} sx={{maxWidth: 300, width: 300}}>
                <CardContent sx = {{display: 'flex'}}>
                    {
                        props.isJson ? <TextSnippetIcon sx = {{fontSize: 32}} /> : <FolderIcon sx = {{fontSize: 32}} />
                    }
                    <Typography variant="h5" noWrap={true}> {props.name} </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
}