import {Breadcrumbs, Snackbar, Box, Grid, InputBase, Link, IconButton} from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SettingsIcon from '@mui/icons-material/Settings';
import {useContext, useState} from "react";
import {themeContext} from "../../Theming/themes";
import ModalSettings from "./ModalSettings.jsx";

export default function RootBar(props){
    const [open, setOpen] = useState(false);
    const [modal, setModal] = useState(false);

    const theme = useContext(themeContext); //get cur color theme
    return (
        <>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                message="In progress"
                onClose={() => setOpen(false)}
            />
            <ModalSettings isOpen={modal} handleClose={setModal}/>
            <Grid container variant={'rootbar'}>
                <Grid item xs={8}>
                    <Box marginTop={0.5} marginLeft={2}>
                        <Breadcrumbs maxItems={4} sx={{fontSize: 'inherit'}}>
                            <Link href={'#'} underline="hover" color="inherit" onClick={() => props.setter([])}>
                                Home
                            </Link>
                            {
                                props.getter.map((folder, index) =>
                                    <Link href={'#'} underline="hover" color={index !== props.getter.length-1 ? "inherit" : "text.primary"} onClick={() => props.setter(props.getter.slice(0, index+1))}>
                                        {folder}
                                    </Link>)
                            }
                        </Breadcrumbs>
                    </Box>
                </Grid>
                <Grid item xs={2} onClick={() => setOpen(true)}>
                    <InputBase sx={{width: '100%', fontSize: 'inherit'}} placeholder={'Search...'} disabled/>
                </Grid>
                <Grid item xs={2}>
                    <Box display="flex" justifyContent="flex-end" marginRight={2}>
                        <IconButton onClick={theme.changeTheme}>
                            {theme.theme.palette.mode === 'dark' ? <Brightness4Icon /> : <Brightness7Icon />}
                        </IconButton>
                        <IconButton onClick={() => setModal(true)}>
                            <SettingsIcon/>
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}