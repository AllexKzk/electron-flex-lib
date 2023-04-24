import {MenuItem} from "@mui/material";
import ItemModal from "./ItemModal";
import {useEffect, useState} from "react";

export default function RightClickItem(props){
    const [isModalOpen, setModal] = useState(false);
    
    return (
        <>
            <MenuItem onClick={() => setModal(true)}>
                {props.itemLabel}
            </MenuItem>

            <ItemModal 
                isOpen={isModalOpen} 
                closeMenu={props.closeMenu} 
                callback={props.callback}
                path={props.path} 
                label={props.modalLabel}
            />
        </>
    );
}
