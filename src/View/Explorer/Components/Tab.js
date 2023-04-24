import { Card, Grid, Typography, CardContent } from "@mui/material";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import FolderIcon from '@mui/icons-material/Folder';

export default function Tab(props) {
    return (
        <Grid item>
            <Card onClick={() => props.callback(props.name)} variant="tab">
                <CardContent variant="tab">
                    {
                        props.isJson ? <TextSnippetIcon sx = {{fontSize: 32}} /> : <FolderIcon sx = {{fontSize: 32}} />
                    }
                    <Typography variant="h5" noWrap={true}> {props.name} </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
}