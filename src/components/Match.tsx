import React, { useState } from 'react';
import Box from '@material-ui/core/Box';

import { firestore } from 'firebase';
import { useDocument } from 'react-firebase-hooks/firestore';
import { useHistory, useParams } from 'react-router';
import { Button, Divider, List, ListItem, ListItemText, Paper, Typography } from '@material-ui/core';

export default function Match() {
  const params = useParams<{ matchId: string }>();

  const [value, loading, error] = useDocument(firestore().doc(`matches/${params.matchId}`), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  const [state, setState] = useState({
    players: [{ name: 'Anita Aune', score: 0 }, { name: 'Brage Nilsson', score: 0 }],
    currentPlayer: 0,
    score: 301,
  });

  const [keypad, setKeypad] = useState(
    [...Array(20).keys()].map(i => ({
      number: i + 1,
      state: 0,
    })),
  );

  const handleKeypadClick = (index: number) => () => {
    const _keypad = [...keypad];
    _keypad[index].state = (_keypad[index].state + 1) % 4;
    setKeypad(_keypad);
  };

  return (
    <Box height="100%" width="100%" display="flex" flexDirection="column">
      <Box flex="1">
        <List>
          {state.players.map((player, index) => {
            const selected = state.currentPlayer === index;
            const color = selected ? 'primary' : 'initial';
            let playerScore = state.score - player.score;

            if (selected) {
              playerScore -= keypad.reduce((acc, current) => {
                switch (current.state) {
                  case 1:
                    return acc + current.number;
                  case 2:
                    return acc + current.number * 2;
                  case 3:
                    return acc + current.number * 3;
                  default:
                    return acc;
                }
              }, 0);
            }

            return (
              <ListItem key={player.name}>
                <ListItemText primary={<Typography color={color}>{player.name}</Typography>} />
                <Typography color={color}>{playerScore}</Typography>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Divider />
      <Box padding="8px">
        <Box display="flex" flexWrap="wrap">
          {keypad.map((key, index) => {
            const colors: { [key: number]: string } = {
              1: '#2196f3',
              2: 'green',
              3: 'red',
            };

            return (
              <Box key={index} flex="1 0 20%" display="flex" alignItems="center" justifyContent="center" p="8px 4px">
                <Button
                  style={key.state > 0 ? { color: colors[key.state] } : {}}
                  color={key.state > 0 ? 'inherit' : 'default'}
                  variant="outlined"
                  fullWidth
                  onClick={handleKeypadClick(index)}
                >
                  {key.number}
                </Button>
              </Box>
            );
          })}
        </Box>
        <Box p="8px">
          <Button variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
