import { useYoutube } from 'react-youtube-music-player';

export default function Youtube(){
  hold =   { playerDetails, actions } = useYoutube({
    id: "h5z99EYHY4Il",
    type: "playlist",
  });
  return(
    <div>
        <h1>Youtube goes here </h1>
    </div>
  );
}
/* there is a youtube installation that has to be done to have a player on it
there is also a google sing in lib for react to add the singin, I think it would be good since it can give you access 
to both regular youtube and ytmusic*/
/* 
https://www.jsdelivr.com/package/npm/react-youtube-music-player 



*/