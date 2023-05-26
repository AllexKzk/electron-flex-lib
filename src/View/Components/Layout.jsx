import {Outlet} from "react-router-dom";
import AlertSnackbar from "../AlertHandling/AlertSnackbar.jsx";
import {AppBar, Box, Container, CssBaseline} from '@mui/material';
import {ThemeProvider} from "@mui/material/styles";
import {themeContext, darkTheme, lightTheme} from "../Theming/themes";
import React, {useContext, useEffect, useState} from "react";

export default function Layout(){
    const [theme, setTheme] = useState(useContext(themeContext).theme);

    useEffect(() => {
        if(localStorage.getItem('mode'))    //get theme stored locally and set it when app launched
            setTheme(localStorage.getItem('mode') === 'dark' ? darkTheme : lightTheme);
    }, []);

    const changeTheme = () => {
        setTheme(theme === darkTheme ? lightTheme : darkTheme);
        localStorage.setItem('mode', theme === darkTheme ? 'light' : 'dark');
    };

    return (
        <themeContext.Provider value={{
            theme: darkTheme,
            changeTheme: () => changeTheme()
        }}>
            <ThemeProvider theme={theme}>
                <Box sx={{
                    bgcolor: 'background.default',
                    minHeight: '100%',
                    minWidth: '100%',
                }}>
                    <CssBaseline/>
                    <AlertSnackbar/>
                    <Outlet/>
                </Box>
            </ThemeProvider>
        </themeContext.Provider>
    );
}