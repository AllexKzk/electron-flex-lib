import {Outlet} from "react-router-dom";
import AlertSnackbar from "../AlertHandling/AlertSnackbar.jsx";
import {Box, CssBaseline} from '@mui/material';
import {ThemeProvider} from "@mui/material/styles";
import {themeContext, darkTheme, lightTheme} from "../Theming/themes.js";
import React, {useContext, useEffect, useState} from "react";

export default function Layout(){
    const [theme, setTheme] = useState(useContext(themeContext).theme);
    const [fontFamily, setFamily] = useState(localStorage.getItem('fontFamily') || '');
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
            changeTheme: () => changeTheme(),
            setFamily: (fontFamily) => setFamily(fontFamily)
        }}>
            <ThemeProvider theme={theme}>
                <Box style={{
                    bgcolor: 'background.default',
                    minHeight: '100%',
                    minWidth: '100%',
                    fontFamily: `${fontFamily}`
                }}>
                    <CssBaseline/>
                    <AlertSnackbar/>
                    <Outlet/>
                </Box>
            </ThemeProvider>
        </themeContext.Provider>
    );
}