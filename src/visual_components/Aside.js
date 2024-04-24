import React, { useState } from 'react';
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
  })


function TransitionsModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');

  const [createNewPlaylist, { loading, data }] = useCreateNewPlaylistMutation();

  // const user = useSelector(state => state.auth.userInfo._id);
  // const [isLoading, userPlaylists] = useFindPlaylistByOwnerQuery();

  return (
    <div>
      <Button style={{ backgroundColor: '#8B93FF', color: 'white', borderRadius:'12px' }} onClick={handleOpen}>
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
            <Typography id="transition-modal-title" variant="h5" component="h2" style={{marginBottom:'10px'}}>
              Create new playlist
            </Typography>
            <div className='create_playlist_name_container' style={{display:'flex', gap:'20px'}}> 
              <CoverImage sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <QueueMusicIcon style={{ fontSize: 40 }} />
              </CoverImage>
              <TextField
                margin="normal"
                required
                // fullWidth
                id="playlistName"
                label="Playlist name"
                name="playlistName"
                autoComplete="playlistName"
                autoFocus
                // color="secondary"
                fullWidth
                value = { playlistName }
                onChange ={(e) => setPlaylistName(e.target.value)}
              />
              </div>
              <TextField
              margin="normal"
              fullWidth
              id="description"
              label="Description"
              name="description"
              autoComplete="description"
              // autoFocus
              multiline
              // color='warning'
              maxRows='5'
              value = { description }
              onChange ={(e) => setDescription(e.target.value)}
            />
            <div className='create_playlist_btn_container' style={{display:'flex', justifyContent:'flex-end'}}>
              <Button style={{ backgroundColor: '#8B93FF', color: 'white', borderRadius:'12px', marginTop:'10px' }} 
              
              onClick={() => createNewPlaylist({name: playlistName, description: description})}>
                Create
            </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

function Aside() {
  return (
    <aside style={{zIndex:'1'}}>
      <TransitionsModal />
    </aside>
  )
}

export default Aside