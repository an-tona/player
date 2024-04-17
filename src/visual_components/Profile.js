import React from 'react'
import EditIcon from '@mui/icons-material/Edit';
import FaceIcon from '@mui/icons-material/Face';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import LogoutIcon from '@mui/icons-material/Logout';
import Typography from '@mui/material/Typography';
import { useFindUserPlaylistsQuery } from '../reducers/slices';

import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { actionLogout } from '../reducers/actions';
import { history } from '../App';


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

function Profile() {
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.auth.userInfo);
  console.log('userInfo', userInfo);

  const { isLoading, data } = useFindUserPlaylistsQuery({_id: userInfo._id});

  return (
    <div className='profile_container'>
        <div className='user_info'>
            <div className='avatar_container'>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CoverImage sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <FaceIcon style={{ fontSize: 40 }} />
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
        </div>

    </div>
  )
}

export default Profile