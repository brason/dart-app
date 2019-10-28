import React, { useState } from 'react';
import Box from '@material-ui/core/Box';

import { auth, firestore } from 'firebase';
import Plus from 'mdi-material-ui/Plus';
import useDialog from '../hooks/useDialog';
import CreateMatch from './CreateMatch';
import Fab from '@material-ui/core/Fab';
import useReactRouter from 'use-react-router';
import { Config } from '../types';

export default function Home() {
  const { location, history } = useReactRouter();

  const { open, component } = useDialog<Config>(CreateMatch, true);

  const handleCreateMatch = async () => {
    const { setType, legType, score, players } = await open({});
    const snap = await firestore()
      .collection('matches')
      .add({
        players: players.map(player => {
          return {
            score: 0,
            setWon: 0,
            legWon: 0,
            ref: firestore().doc(`players/${player.id}`),
          };
        }),
        score,
        setType,
        legType,
        startedAt: firestore.FieldValue.serverTimestamp(),
        currentPlayer: 0,
      });

    history.push(`match/${snap.id}`);
  };

  return (
    <Box height="100%">
      <Box position="absolute" bottom="16px" right="16px">
        <Fab color="primary" variant="extended" onClick={handleCreateMatch}>
          <Plus />
          <Box mr="8px" />
          Create Match
        </Fab>
      </Box>
      {component}
    </Box>
  );
}
