import { Avatar, Box, Button, Checkbox, Container, CssBaseline, FormControlLabel, Grid, Link, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useSignInStore } from './store';
import { shallow } from 'zustand/shallow';
import axios from 'axios';
import { useLocation } from 'wouter';



export default function SignIn() {
  const [location, setLocation] = useLocation();
  const { email, password1, password2, setEmail, setPassword1, setPassword2, signIn, username, setUsername } = useSignInStore(state => ({
    email: state.email,
    password1: state.password1,
    password2: state.password2,
    setEmail: state.setEmail,
    setPassword1: state.setPassword1,
    setPassword2: state.setPassword2,
    signIn: state.signUp,
    username: state.username,
    setUsername: state.setUsername,
  }), shallow);
  // axios.get('').then((res) => {
  // console.log(res.data)
  // })
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signIn().then(() => {
      setLocation('/sign-in', {replace: true})
    });
  };

  const isEmailValid = (email: string) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
  const isPassValid = (pass: string) => pass.length >= 5 && /^(?=(.*[a-zа-я]){1,})(?=(.*[A-ZА-Я]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/.test(pass)
  const isUsernameValid = (username: string) => username.length >= 5;

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
          Регистрация
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
            id="username"
            label="Никнейм"
            name="username"
            autoComplete="username"
            autoFocus
            placeholder='никнейм'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!isUsernameValid(username)}
            helperText={!isUsernameValid(username) ? "Введите ник" : ""}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            placeholder='пароль'
            label="пароль"
            type="password"
            id="password1"
            autoComplete="current-password"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            error={!isPassValid(password1)}
            helperText={!isPassValid(password1)? 'Пароль должен быть не менее 8 символов, содержать верхний и нижний регистр, цифры и спецсимволы': ''}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            placeholder='повторите пароль'
            label="повторите пароль"
            type="password"
            id="password2"
            autoComplete="current-password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            error={!isPassValid(password2)}
            helperText={password1.length > 0 && password1!==password2? 'Пароли не совпадают' : ''}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!isPassValid(password1) || password1!==password2 || !isEmailValid(email) || !isUsernameValid(username)}
          >
          Регистрация
          </Button>
      </Box>
      </Box>
  </Container>
  );
}