import React, { useState } from 'react';
import Box from '@material-ui/core/Box';

import { firestore } from 'firebase';
import { useDocument } from 'react-firebase-hooks/firestore';
import { useHistory, useParams } from 'react-router';
import { Button, Divider, List, ListItem, ListItemText, Paper, Typography } from '@material-ui/core';
import { Match, Player, Score } from '../types';
import ButtonBase from '@material-ui/core/ButtonBase';

enum ArrowState {
  SINGLE,
  DOUBLE,
  TRIPLE,
}

interface Arrow {
  value: number;
  state: ArrowState;
}

function getScore(arrows: Arrow[]): number {
  return arrows.reduce((score, arrow) => {
    switch (arrow.state) {
      case ArrowState.SINGLE:
        return score + arrow.value;
      case ArrowState.DOUBLE:
        return score + arrow.value * 2;
      case ArrowState.TRIPLE:
        return score + arrow.value * 3;
    }
  }, 0);
}

export default function _Match() {
  const params = useParams<{ matchId: string }>();

  const [matchDocument, loading, error] = useDocument(firestore().doc(`matches/${params.matchId}`), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  const [arrows, setArrows] = useState<Arrow[]>([]);

  console.log(arrows);

  const match = matchDocument && (matchDocument.data() as Match);

  const handleArrowClicked = (index: number) => () => {
    const _arrows = [...arrows];
    _arrows[index].state = (_arrows[index].state + 1) % 3;
    setArrows(_arrows);
  };

  const handleKeypadClicked = (value: number) => () => {
    if (arrows.length < 3) {
      setArrows([...arrows, { value, state: ArrowState.SINGLE }]);
    }
  };

  const handleUndoClick = () => {
    const _arrows = [...arrows];
    _arrows.splice(-1, 1);
    setArrows(_arrows);
  };

  const handleSubmitClick = async () => {
    if (match) {
      const _players = [...match.players];
      _players[match.currentPlayerIndex].score += getScore(arrows);

      setArrows([]);

      await firestore()
        .doc(`matches/${params.matchId}`)
        .update({
          ...match,
          currentPlayer: match.currentPlayerIndex = (match.currentPlayerIndex + 1) % match.players.length,
          players: _players,
        });
    }
  };

  return (
    <Box height="100%" width="100%" display="flex" flexDirection="column">
      <Box flex="1">
        <List>
          {match &&
            match.players.map((player, index) => {
              const selected = match.currentPlayerIndex === index;
              const color = selected ? 'primary' : 'initial';
              let playerScore = match.score - player.score;

              if (selected) {
                playerScore -= getScore(arrows);
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
      <Box padding="16px" display="flex">
        {arrows.map((arrow, i) => {
          const colors: { [key: number]: string } = {
            [ArrowState.SINGLE]: 'white',
            [ArrowState.DOUBLE]: '#C8E6C9',
            [ArrowState.TRIPLE]: '#FFCDD2',
          };

          return (
            <Box key={i} mr="16px" onClick={handleArrowClicked(i)}>
              <ButtonBase>
                <Paper style={{ background: colors[arrow.state] }}>
                  <Box width="100px" height="100px" display="flex" alignItems="center" justifyContent="center">
                    <Typography variant="h4">{arrow.value}</Typography>
                  </Box>
                </Paper>
              </ButtonBase>
            </Box>
          );
        })}
      </Box>
      <Divider />
      <Box padding="8px">
        <Box display="flex" flexWrap="wrap">
          {[...Array(20).keys()].map(value => {
            return (
              <Box key={value} flex="1 0 20%" display="flex" alignItems="center" justifyContent="center" p="8px 4px">
                <Button variant="outlined" fullWidth onClick={handleKeypadClicked(value + 1)}>
                  {value + 1}
                </Button>
              </Box>
            );
          })}
        </Box>
        <Box p="8px" display="flex">
          <Button onClick={handleUndoClick} variant="contained" disabled={arrows.length === 0} fullWidth>
            Undo
          </Button>
          <Box mr="8px" />
          <Button
            onClick={handleSubmitClick}
            variant="contained"
            color="primary"
            disabled={arrows.length < 3}
            fullWidth
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
