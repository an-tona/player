import * as React from 'react';
import { useState } from 'react';
import mainLogo from '../images/mainLogo.png';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import FaceIcon from '@mui/icons-material/Face';

import { useHistory } from 'react-router-dom';
import { infiniteSrollSlice } from '../reducers/slices';
import { useDispatch } from 'react-redux';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  marginRight: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '30ch',
      '&:focus': {
        width: '48ch',
      },
    },
  },
}));

function Header() {

  const [inputValue, setInputValue] = useState();
  const dispatch = useDispatch();
  const history = useHistory();


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      dispatch(infiniteSrollSlice.actions.clearScrollState());
      history.push(`/search/${inputValue}`);
    }
  };

  const toolbarStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  }

  return (
  <header>
      <AppBar position="static" sx={{backgroundColor:'#8B93FF'}}>
        <Toolbar style={toolbarStyles}>
          <a 
          onClick={() => history.push('/')}
          ><img src={mainLogo} alt='logo' className='main_logo'/></a>
          <Search className='search_bar'>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              inputProps={{ 'aria-label': 'search' }
            }
            />
          </Search>
         
          <div className='navigation'>
            <nav className='nav_container'> 
              <ul className="nav_list">
                  <li><a className='nav_item'
                  onClick={() => {history.push('/discoverTracks')}}
                  >Tracks</a></li>
                  <li><a 
                  // onClick={() => {history.push('/discoverPlaylists')}}
                  className='nav_item'>Playlists</a></li>
              </ul>
            </nav>
            <a 
            onClick={() => history.push('/profile')}
            ><FaceIcon /></a>
            
          </div>
        </Toolbar>
      </AppBar>
  </header>
  );
}

export { Header }

