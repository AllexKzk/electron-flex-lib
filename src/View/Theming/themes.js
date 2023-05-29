import {createTheme} from "@mui/material/styles";
import {createContext} from "react";
import palette from './palette.json'

//custom themes variants:
const defaultTheme = (mode) => {
    return {
        palette: {
            ...palette[mode]
        },
        components: {
            MuiTypography: {
                styleOverrides: {
                    root: {
                        color: palette[mode].text.primary
                    }
                }
            },
            MuiCardContent: {
                variants: [
                    {
                        props: { variant: 'tab' },
                        style: {
                            display: 'flex',
                            cursor: 'default',
                            backgroundColor: palette[mode].background.card,
                            ":hover": {
                                background: palette[mode].action.hover,
                                transitionDuration: '500ms'
                            },
                            "&:last-child": {
                                paddingBottom: '16px'
                            },
                        },
                    },
                ],
            },
            MuiCssBaseline: {
                styleOverrides: `
                    a {
                        color: ${palette[mode].primary.main};
                    }
                `,
            },
            MuiCard: {
                variants: [
                    {
                        props: { variant: 'tab' },
                        style: {
                            maxWidth: "300px", 
                            width: "300px",
                            ":hover": {
                                transitionDuration: '500ms'
                            }
                        },
                    }
                ],
            },
            MuiGrid: {
                variants: [
                    {
                        props: { variant: 'rootbar' },
                        style: {
                            background: palette[mode].background.card,
                            fontSize: '24px'
                        },
                    }
                ],
            },
            MuiContainer: {
                variants: [
                    {
                        props: { variant: 'quote' },
                        style: {
                            display: 'flex',
                            flexDirection: 'column', 
                            borderLeft: 'solid', 
                            borderColor: palette[mode].text.primary, 
                            fontStyle: 'italic', 
                            m: '2vh 0 2vh 0' 
                        },
                    }
                ],
            },
        }
    };
}

export const lightTheme = createTheme(defaultTheme('light'));
export const darkTheme = createTheme(defaultTheme('dark'));

export const themeContext = createContext({
    theme: darkTheme,
    changeTheme: () => {}
});
