import { Card, Grid, Typography, CardContent } from "@mui/material";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import FolderIcon from '@mui/icons-material/Folder';

export default function Tab(props) {
    const fileName = props.isFile ? props.name.split('.json')[0] : props.name;

    return (
        <Grid item>
            <Card onClick={() => props.callback(props.name)} variant="tab">
                <CardContent variant="tab">
                    {
                        props.isFile ? 
                        <TextSnippetIcon sx = {{fontSize: 32}} /> 
                        : 
                        <FolderIcon sx = {{fontSize: 32}} />
                    }
                    <Typography variant="h5" noWrap={true}> {fileName} </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
}