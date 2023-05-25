import { Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { addHandler, freeHandler } from "./HandlersCollection";

export default function AlertSnackbar() {
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        addHandler(setAlert);
    });

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