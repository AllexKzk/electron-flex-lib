import { Menu } from "@mui/material";
import RightClickItem from "./RightClickItem.jsx";
import { getPage, addFolder } from "./ItemsFunctions";

export default function RightClickMenu(props){

    const getAnchorPosition = () => {
        return props.callMenu ? { top: props.callMenu.mouseY, left: props.callMenu.mouseX } : undefined;
    };

    return (
        <>
            <Menu open={props.callMenu !== null} onClose={props.closeMenu} anchorReference="anchorPosition" anchorPosition={getAnchorPosition()}>
                <RightClickItem path={props.path} closeMenu={props.closeMenu} callback = {getPage} itemLabel={'Добавить страницу'} modalLabel={'URL'} />
                <RightClickItem path={props.path} closeMenu={props.closeMenu} callback = {addFolder} itemLabel={'Добавить папку'} modalLabel={'Название'} />
            </Menu>
        </>
    );
}