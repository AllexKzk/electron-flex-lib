import { Box, Button, Modal, TextField } from "@mui/material";
import { useEffect, useState } from "react";

export default function ModalSettings(props){
    const style = {                         //Box cant styled from theme >_>
        position: 'absolute',
        display: 'flex',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    const [fontSize, setSize] = useState(0);

    useEffect(() => {
        window.electron.getSettings().then(config => {
                setSize(config.text.size);
            }
        );
    }, []);

    const closeModal = () => {
        props.handleClose(false);
        window.electron.updateSettings({    //i think it's worst practice
            text: {                         //so it should be updated 
                size: fontSize              //mb with Redux it'll works fine
            }
        });
    }

    return (
        <Modal open={props.isOpen} onClose={closeModal}>
            <Box sx={style}>
                <TextField onChange={e => setSize(e.target.value)} label="Размер шрифта(px)" type="number" value={fontSize} />
            </Box>
        </Modal>
    );
}