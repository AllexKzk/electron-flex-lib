import { Box, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function ModalSettings(props){
    const style = {                         //Box cant styled from theme >_>
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    const [fontSize, setSize] = useState(localStorage.getItem('fontSize') || 20); //def value is 20px

    const closeModal = () => {
        props.handleClose(false);
        if (fontSize > 0)
            localStorage.setItem('fontSize', fontSize);
    }

    return (
        <Modal open={props.isOpen} onClose={closeModal}>
            <Box sx={style}>
                <TextField onChange={e => setSize(e.target.value)} label="Размер шрифта(px)" type="number" value={fontSize} />
                <Box sx={{marginTop: 4, textAlign: 'center'}}>
                    <Typography variant="caption">
                        CREATED BY: ALLEX KZK <br/>
                        <a href="https://github.com/AllexKzk/electron-flex-lib" target="_blank">
                            GitHub
                        </a>
                    </Typography>
                </Box>
            </Box>
        </Modal>
    );
}