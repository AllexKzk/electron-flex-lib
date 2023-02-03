import {Outlet} from "react-router-dom";
import {Box} from '@mui/material';
import {ThemeProvider} from "@mui/material/styles";
import {themeContext, darkTheme, lightTheme} from "../Root/themes";
import React, {useContext, useState} from "react";
export default function Layout(){
    const [theme, setTheme] = useState(useContext(themeContext).theme);
    return (
        <themeContext.Provider value={{
            theme: darkTheme,
            changeTheme: () => setTheme(theme === darkTheme ? lightTheme : darkTheme)
        }}>
            <ThemeProvider theme={theme}>
                <Box sx={{
                    bgcolor: 'background.default',
                    minHeight: '100%',
                    minWidth: '100%',
                }}>
                    <Outlet/>
                </Box>
            </ThemeProvider>
        </themeContext.Provider>
    );
}