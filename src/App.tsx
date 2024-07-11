import React from 'react';
import './App.css';
import { ThemeProvider } from '@emotion/react';
import { Typography, createTheme } from '@mui/material';
import { Route } from 'wouter';
import SignIn from './modules/signIn';
import SignUp from './modules/signUp';
import MainPage from './modules/MainPage';
import UserMainPage from './modules/UserMainPage';
import Menu from './modules/menu'
import { useAuthStore } from './authStore';
import { shallow } from 'zustand/shallow';
import { ToastContainer } from 'react-toastify';
import PublicImageShow from './modules/PublicImageShow copy';
import UserImages from './modules/UserImages';
import AddImage from './modules/add-image-component';
import Favourite from './modules/favourite-images';

import 'react-toastify/dist/ReactToastify.css';
import AdminView from './modules/admin-view';
import LastPublicImages from './modules/last-public-images';
import UserFavouriteImages from './modules/UserFavouriteImages';
import axios from 'axios';

axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    if (
      error.response.status >= 400 &&
      error.response.status <500 &&
      !error.request.responseURL.includes('auth/login') &&
      !error.request.responseURL.includes('auth/register')
    ) return useAuthStore.getState().logOut();
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });

const theme = createTheme();

function Copyright(props: any) {
  return (
    <Typography style={{marginTop: 'auto'}} variant="body2" color="text.secondary" align="center" {...props}>
      {new Date().getFullYear()}
    </Typography>
  );
}

function App() {
  const { isUserAuth, isUserAdmin } = useAuthStore(state => ({
    isUserAuth: !!state.authUser,
    isUserAdmin: !!state.authUser?.isAdmin,
  }), shallow);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <ToastContainer />
        <Menu/>
        {
          !isUserAdmin && (
            <>
              <Route path='' component={LastPublicImages} />
              <Route path='/image/:imageId' component={PublicImageShow} />
              <Route path='/add-image' component={AddImage} />
            </>
          )
        }

        {
          !isUserAuth? (
            <>
              <Route path='/sign-in' component={SignIn}/>
              <Route path='/sign-up' component={SignUp}/>
            </>
          ): isUserAdmin ? (
            <>
              <Route path='' component={AdminView} />
            </>
          )
          :(
            <>
              <Route path='/images' component={UserImages} />
              <Route path='/favourite-images' component={UserFavouriteImages} />
              <Route path='/favourite' component={Favourite} />
            </>
          )
        }
        <Copyright sx={{ mt: 8, mb: 4 }}/>
      </div>
    </ThemeProvider>
  );
}

export default App;
