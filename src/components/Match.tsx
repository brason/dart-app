import React, { useState } from 'react';
import Box from '@material-ui/core/Box';

import { firestore } from 'firebase';
import { useDocument } from 'react-firebase-hooks/firestore';
import { useHistory, useParams } from 'react-router';
import { Button, Divider, List, ListItem, ListItemText, Paper, Typography } from '@material-ui/core';
import { Arrow, ArrowState, LegType, Match, SetType } from '../types';
import ButtonBase from '@material-ui/core/ButtonBase';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Close from 'mdi-material-ui/Close';

function getArrowScore(arrows: Arrow[]): number {
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

function hasWonLeg(match: Match, arrows: Arrow[]) {
  return match.players[match.currentPlayerIndex].score + getArrowScore(arrows) === match.score;
}

function hasWonSet(legsWon: number, legType: LegType) {
  switch (legType) {
    case LegType.FIRST_TO_1:
      return legsWon === 1;
    case LegType.FIRST_TO_2:
      return legsWon === 2;
    case LegType.FIRST_TO_3:
      return legsWon === 3;
    case LegType.BEST_OF_3:
      return legsWon === 2;
    case LegType.BEST_OF_5:
      return legsWon === 3;
  }
}

function hasWonMatch(setsWon: number, setType: SetType) {
  switch (setType) {
    case SetType.FIRST_TO_1:
      return setsWon === 1;
    case SetType.FIRST_TO_2:
      return setsWon === 2;
    case SetType.FIRST_TO_3:
      return setsWon === 3;
    case SetType.BEST_OF_3:
      return setsWon === 2;
    case SetType.BEST_OF_5:
      return setsWon === 3;
  }
}

export default function _Match() {
  const params = useParams<{ matchId: string }>();

  const history = useHistory();

  const [matchDocument, loading, error] = useDocument(firestore().doc(`matches/${params.matchId}`), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  const [arrows, setArrows] = useState<Arrow[]>([]);

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

      const _match: any = {};

      const currentPlayer = _players[match.currentPlayerIndex];

      const playerScore = getArrowScore(arrows);

      const diff = currentPlayer.score + playerScore - match.score;

      if (diff === 0) {
        currentPlayer.legsWon += 1;
        _match.currentLeg = match.currentLeg + 1;

        if (hasWonSet(currentPlayer.legsWon, match.legType)) {
          currentPlayer.setsWon += 1;

          if (hasWonMatch(currentPlayer.setsWon, match.setType)) {
            _match.concluded = true;
          }
        }

        for (const _player of _players) {
          _player.score = 0;
        }
      } else if (diff < 0) {
        _players[match.currentPlayerIndex].score += playerScore;
      } else if (diff > 0) {
        // Player busted
      }
      setArrows([]);

      await firestore()
        .doc(`matches/${params.matchId}`)
        .update({
          currentPlayerIndex: match.currentPlayerIndex = (match.currentPlayerIndex + 1) % match.players.length,
          players: _players,
          history: [...match.history, { player: currentPlayer, arrows }],
          ..._match,
        });
    }
  };

  console.log(match);

  const handleCloseClicked = () => {
    history.push('/matches');
  };

  return (
    <Box height="100%" width="100%" display="flex" flexDirection="column">
      <AppBar position="relative" color="secondary">
        <Toolbar>
          <IconButton onClick={handleCloseClicked}>
            <Close />
          </IconButton>
          {match && <Typography variant="h6">Leg {match.currentLeg}</Typography>}
          <Box ml="auto" />
        </Toolbar>
      </AppBar>
      {match && !match.concluded && (
        <>
          <Box flex="1">
            <List dense>
              {match.players.map((player, index) => {
                const selected = match.currentPlayerIndex === index;
                const color = selected ? 'primary' : 'initial';
                let playerScore = match.score - player.score;

                if (selected) {
                  playerScore -= getArrowScore(arrows);
                }

                return (
                  <ListItem key={player.name}>
                    <ListItemText
                      primary={<Typography color={color}>{`${player.name} (${player.legsWon})`}</Typography>}
                    />
                    <Typography color={color}>{playerScore}</Typography>
                  </ListItem>
                );
              })}
            </List>
          </Box>
          <Box padding="16px" display="flex" justifyContent="center">
            {arrows.map((arrow, i) => {
              const colors: { [key: number]: string } = {
                [ArrowState.SINGLE]: 'white',
                [ArrowState.DOUBLE]: '#C8E6C9',
                [ArrowState.TRIPLE]: '#FFCDD2',
              };

              return (
                <Box key={i} m="0 8px" onClick={handleArrowClicked(i)}>
                  <ButtonBase>
                    <Paper style={{ background: colors[arrow.state] }}>
                      <Box width="80px" height="64px" display="flex" alignItems="center" justifyContent="center">
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
                  <Box key={value} flex="1 0 20%" display="flex" alignItems="center" justifyContent="center" p="4px">
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
                disabled={arrows.length < 3 && !hasWonLeg(match, arrows)}
                fullWidth
              >
                Submit
              </Button>
            </Box>
          </Box>
        </>
      )}
      {match && match.concluded && (
        <Box flex="1" display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h5">Match has concluded.</Typography>
        </Box>
      )}
    </Box>
  );
}
