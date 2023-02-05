import {Box, Button, MenuItem, Modal, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import {sendRequest} from "./apiWorker";

function ItemModal(props) { //common modal window for items
    const style = {
        position: 'absolute',
        display: 'flex',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const [isOpen, setOpen] = useState(props.isOpen);
    const [input, setInput] = useState('');
    useEffect(() => {
        setOpen(props.isOpen);
    });
    const clicked = () => {
        props.callback(input);
    }
    return (
        <Modal
            open={isOpen}
            onClose={props.menuClose}
        >
            <Box sx={style}>
                <TextField error={props.isErr} id="page-url" value={input} label={props.label} variant="outlined" onChange={e => setInput(e.target.value)} />
                <Button variant="outlined" onClick={clicked}>Добавить</Button>
            </Box>
        </Modal>
    );
}
export function AddPageItem(props){
    const [isModalOpen, setModal] = useState(false);
    const getPage = (url) => {
        props.closeMenu();
        sendRequest(url, props.path, props.updateCallback);
    };
    return (
        <>
        <ItemModal isOpen={isModalOpen} callback={getPage} menuClose={props.closeMenu} label={'URL'}/>
        <MenuItem onClick={() => setModal(true)}>
            Добавить страницу
        </MenuItem>
        </>
    );
}

export function AddFolderItem(props){
    const [isModalOpen, setModal] = useState(false);
    const [isErr, setErr] = useState(false);
    const addFolder = (name) => {
        //check folder name:
        if (['.', '/', '\\', '?', '*', ':'].map(char => name.includes(char)).includes(true) || name === 'con')
            setErr(true);
        else {
            props.closeMenu();
            window.electron.createDir(props.path, name);
        }
    };
    return (
        <>
            <ItemModal isErr={isErr} isOpen={isModalOpen} callback={addFolder} menuClose={props.closeMenu} label={'Название'} />
            <MenuItem onClick={() => setModal(true)}>
                Добавить папку
            </MenuItem>
        </>
    );
}