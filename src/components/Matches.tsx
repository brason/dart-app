import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Play from 'mdi-material-ui/Play';
import Account from 'mdi-material-ui/Account';
import { auth, firestore } from 'firebase';
import Plus from 'mdi-material-ui/Plus';
import useDialog from '../hooks/useDialog';
import CreateMatch from './CreateMatch';
import Fab from '@material-ui/core/Fab';
import useReactRouter from 'use-react-router';
import { Config, Match } from '../types';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import Paper from '@material-ui/core/Paper';
import { useCollection } from 'react-firebase-hooks/firestore';
import { List } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';

export default function Matches() {
  const { location, history } = useReactRouter();

  const { open, component } = useDialog<Config>(CreateMatch, true);

  const [value, loading, error] = useCollection(firestore().collection('matches'), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  const matches: Match[] = value ? value.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match)) : [];

  const handleMatchClick = (id: string) => () => {
    history.push(`/match/${id}`);
  };

  const handleCreateMatch = async () => {
    const { setType, legType, score, players } = await open({});
    const snap = await firestore()
      .collection('matches')
      .add({
        players: players.map(player => {
          return {
            id: player.id,
            name: player.name,
            score: 0,
            setsWon: 0,
            legsWon: 0,
          };
        }),
        score,
        setType,
        legType,
        startedAt: firestore.FieldValue.serverTimestamp(),
        currentLeg: 1,
        currentSet: 1,
        currentPlayerIndex: 0,
        concluded: false,
        history: [],
      });

    history.push(`match/${snap.id}`);
  };

  return (
    <Box height="100%">
      <List>
        {matches.map(match => (
          <ListItem key={match.id} button onClick={handleMatchClick(match.id)}>
            <ListItemText
              primary={match.startedAt ? match.startedAt.toDate().toDateString() : 'Loading...'}
              secondary={`${match.players.map(player => `${player.name}: ${player.legsWon}`).join(' | ')}`}
            />
            {!match.concluded && <Chip label="In progress" />}
          </ListItem>
        ))}
      </List>
      <Box position="absolute" bottom="16px" right="16px">
        <Fab color="primary" onClick={handleCreateMatch}>
          <Plus />
        </Fab>
      </Box>
      {component}
    </Box>
  );
}
