import {Alert, Box, Button, Modal, TextField} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {useEffect, useState} from "react";
import { addHandler } from "../../../AlertHandling/HandlersCollection";

export default function ItemModal(props) {
    const style = { //Box cant styled from theme >_>
        position: 'absolute',
        display: 'block',
        width: '300px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    const [isOpen, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        setOpen(props.isOpen);
        if (props.isOpen) {
            addHandler(setAlert);
        }
    }, [props.isOpen]);

    useEffect(() => {
        if (alert?.type === 'success')
            setTimeout(props.closeMenu, 200);
    }, [alert]);

    const clicked = async() => {
        props.callback(input, props.path);
    }

    const handleEnter = (ev) => {
        if (ev.key === 'Enter'){
            ev.preventDefault();
            clicked();
        }
    }

    return (
        <Modal
            open={isOpen}
            onClose={props.closeMenu}
        >
            <Box sx={style}>
                <Box display={'flex'} >
                    <TextField
                                autoFocus
                                onKeyUp={(ev) => handleEnter(ev)}
                                value={input} 
                                label={props.label} 
                                variant="outlined"
                                onChange={e => setInput(e.target.value)} 
                    />
                    <Button variant="outlined" onClick={clicked}>
                        <AddIcon/>
                    </Button>
                </Box>
                {alert?.message ?<Alert severity={alert?.type}>{alert?.message}</Alert> : <></>}
            </Box>
        </Modal>
    );
}