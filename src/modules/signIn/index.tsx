import { Avatar, Box, Button, Checkbox, Container, CssBaseline, FormControlLabel, Grid, Link, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useSignInStore } from './store';
import { shallow } from 'zustand/shallow';
import axios from 'axios';
import { useLocation } from 'wouter';



export default function SignIn() {
  const [location, setLocation] = useLocation();
  const { email, password, setEmail, setPassword, signIn } = useSignInStore(state => ({
    email: state.email,
    password: state.password,
    setEmail: state.setEmail,
    setPassword: state.setPassword,
    signIn: state.signIn,
  }), shallow);
  // axios.get('').then((res) => {
  // console.log(res.data)
  // })
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    signIn()
    .then(() => {
      setLocation('/');
    })
    .catch(err => {

    });
  };

  const isEmailValid = (email: string) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
  const isPassValid = (pass: string) => pass.length !== 0


  return (
  <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}
      >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
          Войти
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            placeholder='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!isEmailValid(email)}
            helperText={!isEmailValid(email) ? "Почта неверна" : ""}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            placeholder='пароль'
            label="пароль"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!isPassValid(password)}
            helperText={!isPassValid(password)? 'Введите пароль': ''}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
          Войти
          </Button>
          <Grid container>
          <Grid item>
              <Link variant="body2" onClick={()=> {setLocation('/sign-up')}}>
              {"Регистрация"} 
              </Link>
          </Grid>
          </Grid>
      </Box>
      </Box>
  </Container>
  );
}