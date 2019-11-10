import React from 'react';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import State from './State';
import { Route, Switch, useHistory, useLocation } from 'react-router';
import useReactRouter from 'use-react-router';
import Button from '@material-ui/core/Button';
import Match from './components/Match';
import { auth, firestore } from 'firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import IconButton from '@material-ui/core/IconButton';
import Account from 'mdi-material-ui/Account';
import Matches from './components/Matches';
import Paper from '@material-ui/core/Paper';
import BottomNavigation from '@material-ui/core/BottomNavigation/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Play from 'mdi-material-ui/Play';
import Players from './components/Players';

function MainViews() {
  const history = useHistory();
  const location = useLocation();

  const path = location.pathname === '/' ? '/matches' : location.pathname;

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Box position="relative" flex="1">
        <Switch>
          <Route exact path="/(|matches)" component={Matches} />
          <Route exact path="/players" component={Players} />
        </Switch>
      </Box>
      <Paper>
        <BottomNavigation
          value={path}
          onChange={(event, newValue) => {
            history.push(newValue);
          }}
          showLabels
        >
          <BottomNavigationAction value="/matches" label="Matches" icon={<Play />} />
          <BottomNavigationAction value="/players" label="Players" icon={<Account />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

export default function App() {
  const { location, history } = useReactRouter();

  return (
    <State>
      <Box height="100vh">
        <Switch>
          <Route exact path="/(|matches|players)" component={MainViews} />
          <Route path="/match/:matchId" component={Match} />
        </Switch>
      </Box>
    </State>
  );
}
