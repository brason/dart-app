import React from 'react';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import State from './State';
import { Route, Switch } from 'react-router';
import useReactRouter from 'use-react-router';
import Button from '@material-ui/core/Button';
import Match from './components/Match';
import { auth, firestore } from 'firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import IconButton from '@material-ui/core/IconButton';
import Account from 'mdi-material-ui/Account';
import Home from './components/Home';

export default function App() {
  const { location, history } = useReactRouter();

  return (
    <State>
      <Box height="100vh">
        <AppBar color="secondary">
          <Toolbar>
            <Typography variant="h6">Dart App</Typography>
            <Box ml="auto" />
          </Toolbar>
        </AppBar>
        <Box pt="64px" height="calc(100% - 64px)" display="flex">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/match/:matchId" component={Match} />
          </Switch>
        </Box>
      </Box>
    </State>
  );
}
