import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import IconButton from '@mui/material/IconButton';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import preloader from '../images/preloader.gif';
import musicPlayingGif from '../images/music-playing.gif'

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFindPLaylistByNameQuery, useFindTrackQuery } from '../reducers/slices';
import { address, playerSlice, infiniteSrollSlice } from '../reducers/slices';
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

    const { queryValue } = useParams();
    const { isLoading, data } = useFindPLaylistByNameQuery({ playlistName: queryValue }); 
    const playlists = data?.PlaylistFind || [];
    console.log('playlistSearch', isLoading, data);

    const history = useHistory();
    const [page, setPage] = useState(1);
    const playlistsPerPage = 6;
    const totalPages = Math.ceil(playlists.length / playlistsPerPage);

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const startIndex = (page - 1) * playlistsPerPage;
    const endIndex = Math.min(startIndex + playlistsPerPage, playlists.length);
    const currentPlaylists = playlists.slice(startIndex, endIndex);

    return (
        isLoading 
        
        ?

        <div className='playlist_search_preloader_container' style={{display: 'flex'}}>
            <h4>Searching playlists...</h4>
            <img src={preloader} alt='preloader' style={{width:'30px', height:'30px'}}/>
        </div> 
        
        :

        playlists.length === 0 
        ? 
        <h4>No playlists were found</h4>
        :
        <div className='playlist_search_results'>
            <Button
                className='prev_playlist_btn'
                style={{
                    backgroundColor: page === 1 ?'#a9a5b8' : '#8B93FF',
                    color: 'white',
                    borderRadius: '50%',
                    height: '45px',
                    width: '45px',
                    minWidth: '45px',
                    marginTop: '-30px'
                }}
                onClick={handlePrevPage}
            >
                <ArrowBackIosNewIcon />
            </Button>
            <div className='found_playlists' style={{display:'flex', justifyContent:'center', gap:'50px', width:'80%'}}>
            {currentPlaylists.map((playlist, index) => (
                <div
                    key={index}
                    className='playlist_item'
                    style={{ cursor: 'pointer' }}
                    onClick={() => history.push(`/playlist/${playlist._id}`)}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <CoverImage sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <QueueMusicIcon style={{ fontSize: 40 }} />
                        </CoverImage>
                        <Box sx={{ ml: 1.5, minWidth: 0, marginTop: '10px', alignSelf: 'flex-start' }}>
                            <Typography noWrap sx={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {playlist.name}
                            </Typography>
                        </Box>
                    </Box>
                </div>
            ))}
            </div>
            <Button
                className='next_playlist_btn'
                style={{
                    backgroundColor: page === totalPages ?'#a9a5b8' : '#8B93FF',
                    color: 'white',
                    borderRadius: '50%',
                    height: '45px',
                    width: '45px',
                    minWidth: '45px',
                    marginTop: '-30px'
                }}
                onClick={handleNextPage}
            >
                <ArrowForwardIosIcon />
            </Button>
        </div>
    );
};



const TrackSearchContainer = () => {

    // const maxHeight = playlists.length >= 1 ? '30vh' : '42vh';
    const theme = useTheme();
    const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';
    const dispatch = useDispatch();
    const { queryValue } = useParams();



    // const loadedTrackCount = useSelector(state => state.scroll.tracksArr.length);
    // const { isFetching, isLoading, data } = useFindTrackQuery({ track: queryValue, skip: loadedTrackCount}); 
    const { isFetching, isLoading, data } = useFindTrackQuery({ track: queryValue }); 
    const tracks = data?.TrackFind;

    console.log('trackSearch', isFetching, isLoading, data);


    // const handleLoadMore = () => {
    //     if (!isFetching) {
    //       dispatch(infiniteSrollSlice.actions.addTracksToState({tracks}));
    //     }
    // };
  
    // useEffect(() => {
    //     if (!isLoading) {
    //         console.log('USEEFFECT');
    //         handleLoadMore();
    //     }
    //     return () => {
    //         dispatch(infiniteSrollSlice.actions.clearScrollState());
    //     }
    // },[isLoading, queryValue]);
  
  
    // const tracksFromState = useSelector(state => state.scroll.tracksArr);

    const isPlaying = useSelector(state => state.player.isPlaying);
    const currentTrackUrl = useSelector(state => state.player.track?.url);
    const relativeTrackUrl = currentTrackUrl.replace(address, '');

   return (
        isLoading

        ? 

        <div className='track_search_preloader_container' style={{display: 'flex'}}>
            <h4>Searching tracks...</h4>
            <img src={preloader} alt='preloader' style={{width:'30px', height:'30px'}}/>
        </div> 

        :

        <>
        {/* <h4>Tracks found: {tracks ? (tracks.length >= 100 ? '100+' : tracks.length) : 0}</h4> */}
        <div className='track_search_results'>
            <div className='playlist_content'>
                <div className='track_list_header' style={{paddingLeft: '15px'}}>
                    <div className="header_number">#</div>
                    <div className="header_name">Name</div>
                    <div className="header_album">Album</div>
                    <div className="header_year">Year</div>
                </div>
                <div className='separator' style={{borderBottom: '1px solid rgb(57, 62, 70, 0.2)', marginTop:'5px'}}></div>
                <div className='track_list_search' style={{display:'flex', flexDirection:'column', gap:'15px', paddingTop:'15px', overflowY:'scroll', maxHeight:'30vh'}}>

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
                                                    dispatch(playerSlice.actions.setPlaylist({_id: '', tracks: tracks}));
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
        </>
    )
}


function SearchResults() {

    return (
        <div className='search_results_container'>
            <div className='playlist_search_results_container'>
                <PlaylistSearchResults />
            </div>
            <div className='tracks_search_results_container'>
                <TrackSearchContainer />
            </div>
        </div>
    )
}

export default SearchResults