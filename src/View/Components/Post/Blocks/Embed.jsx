import {Link} from "@mui/material";

export default function Embed(props){

	return (
		<>
			{
				props.supported ? 
				<iframe loading="lazy" src={props.src} style={{height: '190px', width: '100%', maxWidth: '100%', border: 0}} /> 
				: 
				<Box sx={{w: '100%', display: 'flex', justifyContent: 'center'}}>
					<Link href={props?.url} target="_blink">EMBED DOESNT SUPPORTED (◡_◡)</Link>
				</Box>
			}
		</>
    );
}