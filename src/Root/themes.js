import {createTheme} from "@mui/material/styles";
import {createContext} from "react";
export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    components: {
        MuiCardContent: {
            styleOverrides: {
                root: {
                    cursor: 'default',
                    ":hover": {
                        background: 'rgba(255, 255, 255, 0.08)',
                        transitionDuration: '500ms'
                    },
                    "&:last-child": {
                        paddingBottom: '16px'
                    },
                }
            }
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: '#fff'
                }
            }
        }
    }
});

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
    components: {
        MuiCardContent: {
            styleOverrides: {
                root: {
                    cursor: 'default',
                    background: 'rgba(255, 255, 255, 0.7)',
                    ":hover": {
                        background: 'rgba(0,0,0,0.04)',
                        transitionDuration: '500ms'
                    },
                    "&:last-child": {
                        paddingBottom: '16px'
                    },
                }
            }
        },
    }
});

export const themeContext = createContext({
    theme: darkTheme,
    changeTheme: () => {}
});
