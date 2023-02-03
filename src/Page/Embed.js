import {Box} from "@mui/material";

export default function Embed(props){
    let frame = <iframe/>;
    switch (props.source) {
        case 'youtube': frame = <iframe id={props.uid}
                                        style={{height: '50vh', width: '100%', border: 0}}
                                        src={'https://www.youtube.com/embed/' + props.uid}
                                />
            break;
        case 'youtube_playlist': frame = <iframe id={props.uid}
                                        style={{height: '50vh', width: '100%', border: 0}}
                                        src={'https://www.youtube.com/embed?listType=playlist&list=' + props.uid}
                                />
            break;
        case 'ya_music': frame = <iframe id={props.uid}
                                         style={{height: '180px', width: '100%', border: 0}}
                                         src={'https://music.yandex.ru/iframe/#track/' + props.uid}
                                />
            break;
        case 'ya_music_playlist': frame = <iframe id={props.uid}
                                         style={{height: '450px', width: '100%', border: 0}}
                                         src={'https://music.yandex.ru/iframe/#playlist/' + props.uid}
                                />
            break;
        case 'spotify': frame = <iframe id={props.uid}
                                  style={{height: '152px', width: '100%', borderRadius: '12px'}}
                                  src={'https://open.spotify.com/embed/track/' + props.uid}
                                />
            break;
        case 'spotify_playlist': frame = <iframe id={props.uid}
                                            style={{height: '152px', width: '100%', borderRadius: '12px'}}
                                            src={'https://open.spotify.com/embed' + props.uid}
                                        />
            break;
        case 'steam': frame = <iframe id={props.uid}
                                  src={"https://store.steampowered.com/widget/" + props.uid}
                                  style={{height: '190px', width: '100%', borderRadius: '12px', border: 0}}
                              />

    }
    return (
      <Box>
          {frame}
      </Box>
    );
}