import { Autocomplete, Box, Checkbox, FormControlLabel, IconButton, Modal, TextField, Typography } from "@mui/material";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { useContext, useState } from "react";
import { themeContext } from "../../../Theming/themes";

export default function ModalSettings(props) {
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
    const [fontFamily, setFontFamily] = useState(localStorage.getItem('fontFamily') || 'Default');
    const [fontSize, setSize] = useState(localStorage.getItem('fontSize') || 20); //def value is 20px
    const [srcPath, setSrcPath] = useState(localStorage.getItem('srcDir') || './sources');
    const [isDownloadMedia, setDownloadMedia] = useState(localStorage.getItem('isDownloadMedia') === 'true');
    const theme = useContext(themeContext);
    const closeModal = () => {
        props.handleClose(false);
        if (fontSize > 0)
            localStorage.setItem('fontSize', fontSize);
        localStorage.setItem('isDownloadMedia', isDownloadMedia);
        if (fontFamily !== 'Default'){
            theme.setFamily(fontFamily);
            localStorage.setItem('fontFamily', fontFamily);
        }
        if (checkPath())
            localStorage.setItem('srcDir', srcPath);
    }

    const checkPath = () => {
        const state = window.electron.checkDirPath(srcPath);
        return state;
    }

    return (
        <Modal open={props.isOpen} onClose={closeModal}>
            <Box sx={style}>
                <TextField label="Размер шрифта(px)"
                    onChange={e => setSize(e.target.value)} 
                    type="number" 
                    value={fontSize}
                />
                <FormControlLabel label="Скачивать медиа"
                    control={<Checkbox checked={isDownloadMedia} 
                                onChange={() => setDownloadMedia(!isDownloadMedia)} 
                            />} 
                />
                <TextField label="Шрифт"
                    value={fontFamily}
                    onChange={e => setFontFamily(e.target.value)}
                />
                <Box display={'flex'} margin={'15px 0'}>
                    <TextField label="Хранилище медиа" 
                        fullWidth
                        value={srcPath}
                        onChange={e => setSrcPath(e.target.value)}
                        color={checkPath() ? "success" : "error"}
                    />
                    <IconButton
                        size={'large'}
                        onClick={() => window.electron.openSource(srcPath)}
                        disabled={!checkPath()}
                    >
                        <FolderOpenIcon/>
                    </IconButton>
                </Box>
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