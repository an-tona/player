import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import IconButton from '@mui/material/IconButton';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import { styled, useTheme } from '@mui/material/styles';

import preloader from '../images/preloader.gif';
import musicPlayingGif from '../images/music-playing.gif'

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFindPLaylistByNameQuery, useFindTrackQuery } from '../reducers/slices';
import { address, playerSlice } from '../reducers/slices';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';


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


const PlaylistSearchResults = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { queryValue } = useParams();
    const { isLoading, data } = useFindPLaylistByNameQuery({ playlistName: queryValue }); 
    const playlists = data?.PlaylistFind;
    console.log('playlistSearch', isLoading, data);

    return (
        isLoading 
        
        ?

        <div className='playlist-search-preloader-container' style={{display: 'flex'}}>
            <h4>Searching playlists...</h4>
            <img src={preloader} alt='preloader' style={{width:'30px', height:'30px'}}/>
        </div> 
        
        :

        <>
        <h4>Playlists found: {playlists.length >= 100 ? '100+' : playlists.length}</h4>
        <div className='playlist-search-results'>
            {playlists.map((playlist, index) => (
                <div key={index} className='playlist-item'
                style={{cursor: 'pointer'}}
                onClick={() => history.push(`/playlist/${playlist._id}`)}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <CoverImage sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <QueueMusicIcon style={{ fontSize: 40 }} />
                        </CoverImage>
                        <Box sx={{ ml: 1.5, minWidth: 0, marginTop: '10px', alignSelf: 'flex-start'}}>
                            <Typography noWrap sx={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {playlist.name}
                            </Typography>
                        </Box>
                    </Box>
                </div>
            ))}
        </div>
        </>
    )
}

const TrackSearchContainer = () => {

    //const maxHeight = playlists.length >= 1 ? '30vh' : '42vh';

    
    const theme = useTheme();
    const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';

    const dispatch = useDispatch();
    const { queryValue } = useParams();
    const {isLoading, data} = useFindTrackQuery({ track: queryValue }); 
    const tracks = data?.TrackFind;

    const [paused, setPaused] = React.useState(true);
    const isPlaying = useSelector(state => state.player.isPlaying);

    const currentTrackUrl = useSelector(state => state.player.track?.url);
    const relativeTrackUrl = currentTrackUrl.replace(address, '');

    console.log('trackSearch', isLoading, data);

   return (
        isLoading 

        ? 

        <div className='track-search-preloader-container' style={{display: 'flex'}}>
            <h4>Searching tracks...</h4>
            <img src={preloader} alt='preloader' style={{width:'30px', height:'30px'}}/>
        </div> 

        :

        <>
        <h4>Tracks found: {tracks ? (tracks.length >= 100 ? '100+' : tracks.length) : 0}</h4>
        <div className='track-search-results'>
            <div className='playlist_content'>
                <div className='track_list_header' style={{paddingLeft: '15px'}}>
                    <div className="header_number">#</div>
                    <div className="header_name">Name</div>
                    <div className="header_album">Album</div>
                    <div className="header_year">Year</div>
                    {/* <AccessTimeIcon className="header-duration" /> */}
                </div>
                <div className='separator' style={{borderBottom: '1px solid rgb(57, 62, 70, 0.2)', marginTop:'5px'}}></div>
                <div className='track_list_search' style={{display:'flex', flexDirection:'column', gap:'15px', paddingTop:'15px', overflowY:'scroll', maxHeight:'42vh'}}>

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
                                                if (relativeTrackUrl === track.url) {
                                                    dispatch(playerSlice.actions.pause());
                                                } else if (track.url === null) {
                                                    alert('File is broken :/');
                                                } else {
                                                    dispatch(playerSlice.actions.setPlaylist({_id: '', tracks: tracks}));
                                                    dispatch(playerSlice.actions.play({url: track.url, index}));
                                                    dispatch(playerSlice.actions.setTrack({ url:track.url, _id: track._id, id3: track.id3 }));
                                                    dispatch(playerSlice.actions.setCurrentTime(0));
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
        </>
    )
}


function SearchResults() {

    return (
        <div className='search-results-container'>
            <div className='playlist-search-results-container'>
                <PlaylistSearchResults />
            </div>
            <div className='tracks-search-results-container'>
                <TrackSearchContainer />
            </div>
        </div>
    )
}

export default SearchResults