import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import AddIcon from '@mui/icons-material/Add';
import LoopIcon from '@mui/icons-material/Loop';
import preloader from '../images/preloader.gif';

import { address, playerSlice } from '../reducers/slices';
import { useDispatch, useSelector } from 'react-redux';



const Widget = styled('div')(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  width: 500,
  maxWidth: '100%',
  margin: 'auto',
  position: 'relative',
  zIndex: 1,
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)',
  backdropFilter: 'blur(40px)',
}));

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

const TinyText = styled(Typography)({
  fontSize: '0.75rem',
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});





function MusicPlayerSlider() {
  // const urlTemp = "track/a9249e23e5c34b73d8147a6d5d4f8c4d";
  // const fullUrl = address + urlTemp;


  const dispatch = useDispatch();
  // const trackUrl = useSelector(state => state.player.track?.url);
  const isPlaying = useSelector(state => state.player.isPlaying);

  const [position, setPosition] = React.useState(0);
  const duration = useSelector(state => Math.round(state.player.track.duration));
  const currentTime = useSelector(state => Math.round(state.player.currentTime));
  const trackUrl = useSelector(state => state.player.track?.url);
  const index = useSelector(state => state.player.playlistIndex);
  const title = useSelector(state => state.player.track.id3?.title);
  const artist = useSelector(state => state.player.track.id3?.artist);
  const currentTrackIndex = useSelector(state => state.player.currentTrackIndex);
  
  const [isChanging, setIsChangind]= useState(false);
  
  useEffect(() => {
      if(!isChanging) {
        setPosition(currentTime);
      }
  }, [currentTime]);

  // const handleKeyPress = (event) => {
  //   if (event.key === 'Space') {
  //     console.log('trackUrl', trackUrl);
  //     dispatch(playerSlice.actions.play({url: trackUrl, index}));
  //   }
  // }

  const theme = useTheme();

  const [paused, setPaused] = React.useState(true);
  function formatDuration(value) {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }
  const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';
  const lightIconColor =
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';

  const [added, setAdded] = useState(false);
  const handleAddIconClick = () => {
    setAdded(!added);
  };

  const [loop, setLoop] = useState(false);
  const handleLoopIconClick = () => {
    dispatch(playerSlice.actions.toggleLoop());
    setLoop(!loop);
  };
  return (
<>
{/* track info */}
    <div className='track_info'>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CoverImage sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <AudiotrackIcon style={{ fontSize: 40 }} />
            </CoverImage>
            <Box sx={{ ml: 1.5, minWidth: 0 }} style={{width:'200px', overflow: 'hidden', textOverflow: 'ellipsis'}}>
            <Typography noWrap >
                <b>{title || 'Untitled'}</b>
            </Typography>
            <Typography noWrap letterSpacing={-0.25}>
                {artist || 'Unknown'}
            </Typography>
            </Box>
        </Box>
    </div>


{/* track duration */}
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Widget>
        <Slider
          aria-label="time-indicator"
          size="small"
          value={position}
          min={0}
          step={1}
          max={duration}
          onChange={(e, value) => (setPosition(value), setIsChangind(true))}
          onChangeCommitted={(e, value) => (dispatch(playerSlice.actions.setCurrentTime(value)), setIsChangind(false))}
          sx={{
            color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
            height: 4,
            '& .MuiSlider-thumb': {
              width: 8,
              height: 8,
              transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
              '&::before': {
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
              },
              '&:hover, &.Mui-focusVisible': {
                boxShadow: `0px 0px 0px 8px ${
                  theme.palette.mode === 'dark'
                    ? 'rgb(255 255 255 / 16%)'
                    : 'rgb(0 0 0 / 16%)'
                }`,
              },
              '&.Mui-active': {
                width: 20,
                height: 20,
              },
            },
            '& .MuiSlider-rail': {
              opacity: 0.28,
            },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: -2,
          }}
        >
          <TinyText>{formatDuration(position)}</TinyText>
          <TinyText>-{formatDuration(duration - position)}</TinyText>
        </Box>

{/* buttons bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: -1,
          }}
        >

{/* add btn */}
        <IconButton
        aria-label="add song"
        onClick={handleAddIconClick}
        style={{
          color: added ? 'rgb(255, 113, 205, 0.9)' : '',
          transform: added ? 'rotate(90deg)' : '',
          transition: 'color 0.3s, transform 0.3s',
        }}
        >
            <AddIcon />
        </IconButton>

{/* prev song btn */}
          <IconButton aria-label="previous song">
            <FastRewindRounded fontSize="large" htmlColor={mainIconColor} 
            onClick={() => (dispatch(playerSlice.actions.setCurrentTime(0)), dispatch(playerSlice.actions.prevTrack()))}
            />
          </IconButton>

{/* play / pause btn */}
          <IconButton
            aria-label={!isPlaying ? 'play' : 'pause'}
            onClick={() => setPaused(!paused)}
          >
            {!isPlaying ? (
              <PlayArrowRounded
                sx={{ fontSize: '3rem' }}
                htmlColor={mainIconColor}
                // onKeyPress={handleKeyPress}
                // onClick={() => (console.log('trackUrl', trackUrl), dispatch(playerSlice.actions.play({url: address + trackUrl, index})))}
                onClick={() => (console.log('trackUrl', trackUrl), dispatch(playerSlice.actions.play({url: trackUrl, index})))}
              />
            ) : (
              <PauseRounded sx={{ fontSize: '3rem' }} htmlColor={mainIconColor} 
              onClick={() => dispatch(playerSlice.actions.pause())}
              />
            )}
          </IconButton>

{/* next song btn */}
        <IconButton aria-label="next song" 
        onClick={() => (dispatch(playerSlice.actions.setCurrentTime(0)), dispatch(playerSlice.actions.nextTrack()))}
        >
            <FastForwardRounded fontSize="large" htmlColor={mainIconColor} />
        </IconButton>

{/* repeat song btn */}
        <IconButton
            aria-label="repeat song"
            onClick={handleLoopIconClick}
            style={{
                color: loop ? 'rgb(255, 113, 205, 0.9)' : '',
                transform: loop ? 'rotate(90deg)' : '',
                transition: 'color 0.3s, transform 0.3s',
             }}
        >
            <LoopIcon />
        </IconButton>

{/* track loading icon */}

             {/* <img src={preloader} alt='track loading' id='track_isLoading_img' style={{width:'25px', height:'25px', position:'absolute', right:'18%', display:'none'}}/> */}
        </Box>
      </Widget>
    </Box>



{/* volume slider */}
    <div className='volume_slider'>
        <Stack spacing={2} direction="row" sx={{ mb: 1, px: 1 }} alignItems="center">
            <VolumeDownRounded htmlColor={lightIconColor} />
            <Slider
            aria-label="Volume"
            defaultValue={100}
            sx={{
                color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
                '& .MuiSlider-track': {
                border: 'none',
                },
                '& .MuiSlider-thumb': {
                width: 24,
                height: 24,
                backgroundColor: '#fff',
                '&::before': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                },
                '&:hover, &.Mui-focusVisible, &.Mui-active': {
                    boxShadow: 'none',
                },
                },
            }}
            onChange={(e, value) => dispatch(playerSlice.actions.setVolume(value / 100))}
            />
            <VolumeUpRounded htmlColor={lightIconColor} />
        </Stack>
    </div>
</>
  );
}

function Footer() {
    return (
      <footer style={{zIndex:'2'}} className="footer">
        <div className="footer-content">
            <MusicPlayerSlider />
        </div>
      </footer>
    );
  }

export default Footer