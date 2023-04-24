import {Alert, Box, Button, Modal, TextField} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {useEffect, useState} from "react";

export default function ItemModal(props) {
    const style = { //Box cant styled from theme >_>
        position: 'absolute',
        display: 'flex',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    const [isOpen, setOpen] = useState(props.isOpen);
    const [input, setInput] = useState('');
    const [alertMessage, setAlert] = useState(null);

    useEffect(() => {
        setOpen(props.isOpen);
    });
    const clicked = async() => {
        props.callback(input, props.path, setAlert)
        .then(res => {
            if (res) props.closeMenu();
        });
    }
    return (
        <Modal
            open={isOpen}
            onClose={props.closeMenu}
        >
            <Box sx={style}>
                <TextField helperText={alertMessage} error={alertMessage != null} value={input} label={props.label} variant="outlined" onChange={e => setInput(e.target.value)} />
                <Button variant="outlined" onClick={clicked}>
                    <AddIcon/>
                </Button>
            </Box>
        </Modal>
    );
}