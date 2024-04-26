import React from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useFindPlaylistByIdQuery } from '../reducers/slices';
import preloader from '../images/preloader.gif';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import IconButton from '@mui/material/IconButton';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import { styled, useTheme } from '@mui/material/styles';
import musicPlayingGif from '../images/music-playing.gif'


import { address, playerSlice } from '../reducers/slices';

const CoverImage = styled('div')({
    width: 100,
        height: 100,
        objectFit: 'cover',
        overflow: 'hidden',
        flexShrink: 0,
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.08)',
        '& > img': {
            width: '100%',
        },
});


function Playlist() {
    const theme = useTheme();
    const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';
  
    const { playlistId } = useParams();
    const { isLoading, data } = useFindPlaylistByIdQuery({_id : playlistId});

    console.log('playlistById', isLoading, data)

    const playlist = data?.PlaylistFindOne;
    const tracks = playlist?.tracks;

    const dispatch = useDispatch();
    const isPlaying = useSelector(state => state.player.isPlaying);

    const currentTrackUrl = useSelector(state => state.player.track?.url);
    const statePlaylistId = useSelector(state => state.player.playlist._id)
    
    const relativeTrackUrl = currentTrackUrl.replace(address, '');
  return (
    isLoading 
    
    ?

    <div></div> 
    
    :

    <div className="playlist">
        <div className='playlist_info'>
            <div className='playlist_info_left'>
                <div className='playlist_icon'>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <CoverImage sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <QueueMusicIcon style={{ fontSize: 40 }} />
                        </CoverImage>
                    </Box>
                </div>
                <div className='playlist_name'>
                    <Box sx={{ ml: 1.5, minWidth: 0, marginTop: '15px', alignSelf: 'flex-start', width:'300px'}}>
                        <Typography noWrap sx={{ maxWidth: '80%', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '1.6rem' }}>
                            {playlist.name || 'Untitled Playlist'}
                        </Typography>
                        <Typography noWrap sx={{ maxWidth: '80%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {playlist.description || null}
                        </Typography>
                    </Box>
                </div>
               
            </div>
            <div className='playlist_info_right'>
                <div className='playlist_owner'>
                    <Box sx={{ ml: 1.5, minWidth: 0, marginTop: '15px', alignSelf: 'flex-end', width:'300px'}}>
                        <Typography noWrap sx={{ maxWidth: '80%', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom:'10px' }}>
                            Created by <b>{playlist.owner.nick || playlist.owner.login}</b>
                        </Typography>
                    </Box>
                </div>
                <div className='playlist_track_count'>
                    <Box sx={{ ml: 1.5, minWidth: 0, marginTop: '-10px', alignSelf: 'flex-end', width:'300px'}}>
                        <Typography noWrap sx={{ maxWidth: '80%', overflow: 'hidden'}}>
                            {playlist?.tracks?.length || '0'} {playlist?.tracks?.length !== 1 ? 'tracks' : 'track'}
                        </Typography>
                    </Box>
                </div>
            </div>
        </div>
        <div className='playlist_content'>

            <div className='track_list_header' style={{paddingLeft: '15px'}}>
                <div className="header_number">#</div>
                <div className="header_name">Name</div>
                <div className="header_album">Album</div>
                <div className="header_year">Year</div>
                {/* <AccessTimeIcon className="header-duration" /> */}
            </div>
            <div className='separator' style={{borderBottom: '1px solid rgb(57, 62, 70, 0.2)', marginTop:'5px'}}></div>
            <div className='track_list' style={{display:'flex', flexDirection:'column', gap:'15px', paddingTop:'15px', overflowY:'scroll', maxHeight:'42vh'}}>

                {tracks?.map((track, index) => (
                    <div key={track._id} className='track_item' >
                        <div className='track_item_container' style={{paddingLeft:'15px', display: 'flex'}}>
                            <div className='track_number_container'>
                                <div className='track_number'>
                                    <span style={{ display: isPlaying && relativeTrackUrl === track.url ? 'none' : 'block' }}>
                                        {index + 1}
                                    </span>
                                    <img
                                        src={isPlaying && relativeTrackUrl === track.url ? musicPlayingGif : null}
                                        alt='music playing'
                                        style={{width:'25px', display: isPlaying && relativeTrackUrl === track.url ? 'block' : 'none'}}
                                    />
                                </div>
                                <div className='play_pause_btn'>
                                    <IconButton
                                        aria-label={!isPlaying && relativeTrackUrl !== track.url ? 'play' : 'pause'}
                                        onClick={() => {
                                            if (relativeTrackUrl === track.url && isPlaying) {
                                                dispatch(playerSlice.actions.pause());
                                            } else if (track.url === null) {
                                                alert('File is broken :/');
                                            } else {
                                                if (statePlaylistId !== playlist._id) {
                                                    dispatch(playerSlice.actions.setPlaylist({_id: playlist._id, tracks: tracks}));
                                                }
                                                if (relativeTrackUrl !== track.url) {
                                                    dispatch(playerSlice.actions.setCurrentTime(0));
                                                }
                                                dispatch(playerSlice.actions.play({url: track.url, index}));
                                                dispatch(playerSlice.actions.setTrack({ url:track.url, _id: track._id, id3: track.id3 }));
                                            }
                                        }}
                                        style={{ marginLeft: '-10px' }}
                                    >
                                        {isPlaying && relativeTrackUrl === track.url ? (
                                        <PauseRounded sx={{ fontSize: '1.5rem' }} htmlColor={mainIconColor} />
                                        ) : (
                                        <PlayArrowRounded
                                            sx={{ fontSize: '1.5rem' }}
                                            htmlColor={mainIconColor}
                                        />
                                        )}
                                    </IconButton>
                                </div>
                            </div>
                            <div className='track_name_container' style={{display: 'flex', gap:'15px'}}>
                                <div className='track_icon'>
                                    <CoverImage sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width:'44px', height:'44px'}}>
                                        <AudiotrackIcon style={{ fontSize: 24 }} />
                                    </CoverImage>
                                </div>
                                <div className='track_name_artist'>
                                    <Typography className='track_name'>
                                        {track?.id3?.title || 'Untitled'}
                                    </Typography>
                                    <Typography className='track_artist' sx={{fontSize: 14}}>
                                        {track?.id3?.artist || 'Unknown'}
                                    </Typography>
                                </div>
                            </div>
                                <Typography className='track_album'>
                                    {track?.id3?.album || 'Unknown'}
                                </Typography>
                                <Typography className='track_year'>
                                    {track?.id3?.year || 'Unknown'}
                                </Typography>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Playlist