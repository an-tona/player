import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import IconButton from '@mui/material/IconButton';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';

import preloader from '../images/preloader.gif';
import musicPlayingGif from '../images/music-playing.gif'

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFindAllTracksQuery, infiniteSrollSlice } from '../reducers/slices';
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


function DiscoverTracks() {
    const theme = useTheme();
    const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';

    const history = useHistory();
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(infiniteSrollSlice.actions.clearTracksArr());
        handleLoadMore();
        console.log('TracksArr cleared');
    }, []);

    

    const loadedTrackCount = useSelector(state => state.scroll.tracksArr.length)
    console.log('loadedTrackCount', loadedTrackCount)

    const { isFetching, data } = useFindAllTracksQuery({skip: loadedTrackCount});
    console.log('useFindAllTracksQuery', isFetching, data);
    const tracks = data?.TrackFind;

    const tracksFromState = useSelector(state => state.scroll.tracksArr);
    // dispatch(infiniteSrollSlice.actions.addTracksToState({tracks}));
    const handleLoadMore = () => {
      if (!isFetching) {
        dispatch(infiniteSrollSlice.actions.addTracksToState({tracks}));
      }
    };

    useEffect(() => {
      // handleLoadMore();
  
      // document.addEventListener("scroll", onScroll);
      // return function () {
      //   document.removeEventListener("scroll", onScroll);
      // };
    }, [loadedTrackCount, isFetching]);




    const isPlaying = useSelector(state => state.player.isPlaying);
    const currentTrackUrl = useSelector(state => state.player.track?.url);
    const relativeTrackUrl = currentTrackUrl.replace(address, '');

    return (
      // isFetching 

      // ? 
      
      // <div className='track-search-preloader-container' style={{display: 'flex'}}>
      //     <h4>Loading tracks...</h4>
      //     <img src={preloader} alt='preloader' style={{width:'30px', height:'30px'}}/>
      // </div> 

      // :

      <>
      <h2>Discover new tracks</h2>
      <div className='track-search-results'>
          <div className='playlist_content'>
              <div className='track_list_header' style={{paddingLeft: '15px'}}>
                  <div className="header_number">#</div>
                  <div className="header_name">Name</div>
                  <div className="header_album">Album</div>
                  <div className="header_year">Year</div>
              </div>
              <div className='separator' style={{borderBottom: '1px solid rgb(57, 62, 70, 0.2)', marginTop:'5px'}}></div>
              <div className='track_list_discovery' style={{display:'flex', flexDirection:'column', gap:'15px', paddingTop:'15px', overflowY:'scroll', maxHeight:'57vh'}}>

                  {tracksFromState?.map((track, index) => (
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
                                                  dispatch(playerSlice.actions.setPlaylist({_id: '', tracks: tracksFromState}));
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

                  <div className='load_more' style={{ display:'flex', justifyContent:'center' }}>
                    <Button
                    style={{ backgroundColor: '#8B93FF', color: 'white', borderRadius:'12px' }}
                    onClick={() => {
                      handleLoadMore()
                    }}
                    > {isFetching ? "Loading..." : "Load More"}</Button>
                  </div>
              </div>
          </div>
      </div>
      </>
  )
}

export default DiscoverTracks