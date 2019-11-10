import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import { useCollection } from 'react-firebase-hooks/firestore';
import { firestore } from 'firebase';
import { Match, Player } from '../types';
import { List } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

export default function Players() {
  const [value, loading, error] = useCollection(firestore().collection('players'), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  const players: Player[] = value ? value.docs.map(doc => doc.data() as Player) : [];

  return (
    <Box height="100%">
      <List>
        {players.map(player => (
          <ListItem key={player.id} button>
            <ListItemText primary={player.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
