import React, { useState, useEffect } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { useCreateNewPlaylistMutation, useFindPlaylistByOwnerQuery } from '../reducers/slices';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import preloader from '../images/preloader.gif';
import EditPlaylist from './UserPlaylist';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #8B93FF',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

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

const UserPlaylists = ({ playlists }) => {
  const history = useHistory();

  return (
    <div className='user_playlists_container' style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
      {playlists && playlists.map((playlist, index) => (
        <div
          key={index}
          className='user_playlist_item'
          style={{ cursor: 'pointer', borderRadius: '12px' }}
          onClick={() => history.push(`/playlist/${playlist._id}`)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start' }}>
            <CoverImage sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }}>
              <QueueMusicIcon style={{ fontSize: 20 }} />
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
  );
};

function Aside() {
  const userId = useSelector(state => state.auth.userInfo._id);
  const [playlists, setPlaylists] = useState([]);
  const { isLoading, data } = useFindPlaylistByOwnerQuery({ _id: userId });

  useEffect(() => {
    if (!isLoading && data) {
      setPlaylists(data?.PlaylistFind || []);
    }
  }, [isLoading, data]);

  return (
    <aside style={{ zIndex: '1' }}>
      {isLoading ? (
        <div>
          <img src={preloader} alt='preloader' style={{ width: '30px', height: '30px' }} />
        </div>
      ) : (
        <>
          <UserPlaylists playlists={playlists} />
          <TransitionsModal setPlaylists={setPlaylists} />
        </>
      )}
    </aside>
  );
}

const DNDTrack = ({track}) => (
  <div key={track?._id} className='track_item_drag' >
                      <div className='track_item_container' style={{paddingLeft:'15px', display: 'flex'}}>
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
                      </div>
  </div>
)

function TransitionsModal({ setPlaylists }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setPlaylistName('');
    setDescription('');
    setOpen(false);
  }

  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');

  const [createNewPlaylist, { loading, data }] = useCreateNewPlaylistMutation();

  const handleCreatePlaylist = async () => {
    const tracksWithoutUrl = tracks.map(track => {
      const { url, ...rest } = track;
      return rest;
    });
    const result = await createNewPlaylist({ name: playlistName, description: description, tracks: tracksWithoutUrl });
    if (result.data) {
      console.log('result.data', result.data)
      setPlaylists(prevPlaylists => [...prevPlaylists, result.data?.PlaylistUpsert]);
      handleClose();
    }
  };


  // const [playlist, setPlaylist] = useState({ _id: '', name: '', description: '', tracks: [] });
  const [tracks, setTracks] = useState([]);

  const handleSave = (playlistData) => {
      console.log(playlistData);
  }

  const handleSaveButtonClick = () => {
      handleSave(tracks);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Button style={{ backgroundColor: '#8B93FF', color: 'white', borderRadius: '12px' }} onClick={handleOpen}>
        <AddIcon />
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h5" component="h2" style={{ marginBottom: '10px' }}>
              Create new playlist
            </Typography>
            <div className='create_playlist_name_container' style={{ display: 'flex', gap: '20px' }}>
              <CoverImage sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <QueueMusicIcon style={{ fontSize: 40 }} />
              </CoverImage>
              <TextField
                margin="normal"
                required
                id="playlistName"
                label="Playlist name"
                name="playlistName"
                autoComplete="playlistName"
                autoFocus
                fullWidth
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
              />
            </div>
            <TextField
              margin="normal"
              fullWidth
              id="description"
              label="Description"
              name="description"
              autoComplete="description"
              multiline
              maxRows='5'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <EditPlaylist trackArr={tracks} onSave={setTracks} renderComp={DNDTrack} />
            <div className='create_playlist_btn_container' style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button style={{ backgroundColor: '#8B93FF', color: 'white', borderRadius: '12px', marginTop: '10px' }}
                onClick={handleCreatePlaylist}
              >
                Create
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default Aside;
