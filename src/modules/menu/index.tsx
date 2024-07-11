import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import {useAuthStore} from '../../authStore'
import { shallow } from 'zustand/shallow';
import { useLocation } from 'wouter'
import { Autocomplete, TextField } from '@mui/material';
import { Tag, useSearchStore } from './state';
import search from './icons8-search.svg';
import ImagesSearch from './images-from-search';
import PlusIcon from '../../svg/plus-frame-svgrepo-com.svg'

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
  const [location, setLocation] = useLocation();
  console.log(location)
  const { isUserAuth, user, logout } = useAuthStore(state => ({
    isUserAuth: !!state.authUser,
    user: state.authUser,
    logout: state.logOut,
  }), shallow);

  const {setFilter, fetchTags, filter, tagsAutoComplete, selectedTags, setSelectedTags, isLoadingTags} = useSearchStore(state => ({
    setFilter: state.setTagFilterText,
    fetchTags: state.getTags,
    filter: state.tagFilterText,
    tagsAutoComplete: state.tags,
    selectedTags: state.selectedTags,
    setSelectedTags: state.setSelectedTags,
    isLoadingTags: state.isLoadingTags,
  }))


  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      {/* <ImagesSearch /> */}
      <Container maxWidth="xl" style={{height: '64px'}}>
        <Toolbar disableGutters style={{height: '64px'}}>
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <Typography
            variant="h6"
            component="a"
            sx={{
              cursor: 'pointer',
              mr: 2,
              display: { xs: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
            onClick={() => setLocation('/')}
          >
            Hosty
          </Typography>

          {/* <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box> */}
          {/* {
            !user?.isAdmin && (location === '' || location === '/') && (
              <Box sx={{
                marginLeft: 'auto',
                marginRight: 'auto',
                display: 'flex',
                flexDirection: 'row',
                textTransform: 'capitalize',
                minWidth: '100px',
                maxWidth: '250px',
                width: '100%'
              }}>
            <img src={search} alt='' width={'30px'} height={'30px'} style={{marginRight: '5px'}}/>
            <Autocomplete
              id="size-small-outlined"
              loading={isLoadingTags}
              multiple
              size="small"
              noOptionsText={isLoadingTags && !tagsAutoComplete.length ? 'поиск тегов' : 'введите фильтр'}
              options={tagsAutoComplete}
              value={selectedTags}
              getOptionLabel={(option: Tag) => option.name}
              onOpen={() => fetchTags()}
              onChange={(e, value) => setSelectedTags(value)}
              autoCapitalize=''
              classes={{
                popper: 'popper-custom'
              }}
              style={{
                width: '100%'
              }}
              ListboxProps={{
                style: {
                  minWidth: '200px',
                  textTransform: 'capitalize'
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  className={'autocomplete-input-component'}
                  onChange={(e: any) => {
                    setFilter(e.target.value)
                    fetchTags()
                  }}
                  value={filter}
                  variant="standard"
                  placeholder="Тэг"
                />
              )}
            />
          </Box>
          )
          } */}

          {
            !user?.isAdmin && <Typography
              variant="h6"
              component="a"
              sx={{
                mr: 2,
                display: { xs: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                marginLeft: 'auto',
                cursor: 'pointer',
              }}
              onClick={() => setLocation('/add-image')}
            >
              <img src={PlusIcon} width='20px' height='20px' alt=''/>
            </Typography>
          }
          

          <Box sx={{ flexGrow: 0, marginLeft: !user?.isAdmin? '10px': 'auto', maxWidth: '45vw' }}>
            <Tooltip title="">
              {
                isUserAuth?(
                  <Button onClick={handleOpenUserMenu} sx={{ p: 0 }} style={{ color: 'white',  maxWidth: '45vw' }}>
                    <div style={{ maxWidth: '45vw', overflow: 'hidden', textOverflow: 'ellipsis'}}>{user?.username}</div>
                  </Button>
                  ):(
                  <IconButton style={{color: 'white'}} onClick={() => {setLocation('/sign-in')}} sx={{ p: 0 }}>
                    Войти
                  </IconButton>
                )
              }
              
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {
                isUserAuth?
                  user?.isAdmin?(
                    [
                      <MenuItem key={'выйти'} onClick={handleCloseUserMenu}>
                        <Typography textAlign="center" onClick={() => {logout(); setLocation('/')}}>{'Выйти'}</Typography>
                      </MenuItem>
                    ]
                  ): (
                    [
                      <MenuItem key={'изображения'} onClick={handleCloseUserMenu}>
                        <Typography textAlign="center" onClick={() => {setLocation('/images')}}>{'Изображения'}</Typography>
                      </MenuItem>,
                      <MenuItem key={'избранное'} onClick={handleCloseUserMenu}>
                        <Typography textAlign="center" onClick={() => {setLocation('/favourite-images')}}>{'Избранное'}</Typography>
                      </MenuItem>,
                      <MenuItem key={'выйти'} onClick={handleCloseUserMenu}>
                        <Typography textAlign="center" onClick={() => {logout(); }}>{'Выйти'}</Typography>
                      </MenuItem>
                    ]
                  ):(
                  <MenuItem key={'войти'} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center" onClick={() => {setLocation('/sign-in')}}>{'Войти'}</Typography>
                  </MenuItem>
                )
              }
              {/* {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))} */}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
