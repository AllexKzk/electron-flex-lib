import { Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { addHandler, freeHandler } from "./HandlersCollection";

//snackbar for top handler:
export default function AlertSnackbar() {
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        console.log('add handler')
        addHandler(setAlert);
    }, []);

    const handleClose = () => {
        setAlert(null);
        freeHandler();
    }

    return (
        <Snackbar 
            open={alert !== null}
            autoHideDuration={3000}
            message={alert?.message}
            onClose={handleClose}
        />
    );
}