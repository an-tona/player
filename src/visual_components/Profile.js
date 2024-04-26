import React, { useEffect } from 'react'
import { useFindUserPlaylistsQuery, address, useSetUserAvatarMutation, authSlice } from '../reducers/slices';
import {useDropzone} from 'react-dropzone'
import { useDispatch, useSelector } from 'react-redux';
import { useState, useCallback } from 'react';
import { actionLogout } from '../reducers/actions';
import { history } from '../App';

import TextField from '@mui/material/TextField';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import EditIcon from '@mui/icons-material/Edit';
import FaceIcon from '@mui/icons-material/Face';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import LogoutIcon from '@mui/icons-material/Logout';
import Typography from '@mui/material/Typography';

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

  function Dropzone({onFileUploaded, text}) {
    const token = useSelector(state => state.auth.token)
    const formData = new FormData()
    const onDrop = useCallback(acceptedFiles => {
      const handleFileUploaded = (fileId) => {
      onFileUploaded(fileId);
    }
      formData.append("photo", acceptedFiles[0])
      const onFile = async() => fetch(address + 'upload', {
        method: "POST",
        headers: token ? {Authorization: 'Bearer ' + token} : {},
        body: formData
      }).then(res => res.json()).then(data => handleFileUploaded(data))
    onFile()
    }, []) 
    const {acceptedFiles, getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    useEffect(() => {
      //////////////////////////////
    },[acceptedFiles])

    return (
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} className='dropzone-input' />
        {
          isDragActive ?
            <p style={{fontSize: "15px", margin: "10px"}}>Drop the files here ...</p> :
            <p style={{fontSize: "12px", cursor:'pointer'}}>{text}</p>
        }
      </div>
    )
  }

const UserPlaylistProfile = () => {
  const userId = useSelector(state => state.auth.userInfo._id);
}

function Profile() {
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.auth.userInfo);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setUploadedFileId(null), 150); //for visual purposes
  }

  const [nickname, setNickname] = useState(`${userInfo.nick || userInfo.login}`);
  const userId = useSelector(state => state.auth.userInfo._id);
  const avatarUrl = useSelector(state => state.auth.userInfo.avatar?.url);
  const [setAvatar, {isLoading}] = useSetUserAvatarMutation()
  const [uploadedFileId, setUploadedFileId] = useState(null);

  const handleFileUploaded = (fileId) => {
    setUploadedFileId(fileId);
  }

  const handleSaveChanges = () => {
    setAvatar({id: userId, avatarId: uploadedFileId._id});
    dispatch(authSlice.actions.setAvatar({avatar:uploadedFileId}));
    handleClose();
  }

  return (
    <div className='profile_container'>
        <div className='user_info'>
            <div className='avatar_container'>
            <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', overflow:'hidden' }}>
                <CoverImage sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}} className='avatar'>
                {userInfo.avatar ? (
                  <img src={address + avatarUrl} alt="avatar" className="avatar_img" />
                ) : (
                  <FaceIcon style={{ fontSize: 40 }} />
                )}
                  <div className='avatar_hover_container' onClick={handleOpen}>
                    <EditIcon />
                  </div>
                </CoverImage>
            </Box>
            </div>
            <div className='name_container'>
              <Typography sx={{fontSize:'40px'}}>{userInfo.nick || userInfo.login}</Typography>
            </div>
            <div className='edit_user_info_container'>
                <EditIcon />
            </div>
            <div onClick={() => (dispatch(actionLogout()), history.push('/sign-in'))}>
            Logout
            <LogoutIcon />
            </div>

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
                    Edit your profile
                  </Typography>
                  <div className='edit_profile_container' style={{ display: 'flex', gap: '20px' }}>
                    <CoverImage sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position:'relative'}} className='avatar'>
                    {userInfo.avatar ? (
                      <img src={uploadedFileId?.url ? (address + uploadedFileId.url) : (address + avatarUrl)} alt="change avatar" className="avatar_img" />
                    ) : (
                      <FaceIcon style={{ fontSize: 40 }} />
                    )}
                    <div className='avatar_hover_container' onClick={handleOpen}>
                      <Dropzone onFileUploaded={handleFileUploaded} text='Choose image'/>
                      <EditIcon />
                      <p style={{fontSize:'12px', cursor:'pointer'}} onClick={() => console.log('TO DO')}>Remove avatar</p> {/* TO DO */}
                    </div>
                </CoverImage>
                    <TextField
                      margin="normal"
                      id="nickname"
                      label="Nickname"
                      name="nickname"
                      autoComplete="nickname"
                      autoFocus
                      fullWidth
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                    />
                  </div>

                  <div className='create_playlist_btn_container' style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button style={{ backgroundColor: '#8B93FF', color: 'white', borderRadius: '12px', marginTop: '10px' }}
                      onClick={handleSaveChanges}
                    >
                      Save
                    </Button>
                  </div>
                </Box>
              </Fade>
            </Modal>
        </div>

    </div>
  )
}

export default Profile