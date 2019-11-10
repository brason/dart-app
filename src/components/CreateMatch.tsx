import React, { useState } from 'react';
import Box from '@material-ui/core/Box';

import SelctableChip from './SelectableChip';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import { useCollection } from 'react-firebase-hooks/firestore';
import { firestore } from 'firebase';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Close from 'mdi-material-ui/Close';
import { Route, Switch } from 'react-router';
import Matches from './Matches';
import Match from './Match';
import IconButton from '@material-ui/core/IconButton';
import { Config, LegType, Score, SetType } from '../types';

const styles = {
  control: (base: any) => ({
    ...base,
    fontFamily: 'Roboto',
  }),
  menu: (base: any) => ({
    ...base,
    fontFamily: 'Roboto',
  }),
};

function isOption(selected: any): selected is { label: string; value: string } {
  return selected && 'value' in selected && 'label' in selected;
}

interface CreateMatchProps {
  onAccept: (config: Config) => void;
  onDecline: () => void;
}

export default function CreateMatch({ onAccept, onDecline }: CreateMatchProps) {
  const [config, setConfig] = useState<Config>({
    players: [],
    setType: SetType.FIRST_TO_1,
    legType: LegType.BEST_OF_3,
    score: Score.SCORE_301,
  });

  const [value, loading, error] = useCollection(firestore().collection('players'), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  const users = value ? value.docs.map(doc => ({ id: doc.id, name: doc.data().name })) : [];

  const handleStartMatch = async () => {
    onAccept(config);
  };

  const handleConfigChange = (field: string, value: any) => {
    setConfig(config => ({ ...config, [field]: value }));
  };

  return (
    <Box p="16px">
      <AppBar color="secondary">
        <Toolbar>
          <IconButton onClick={onDecline}>
            <Close />
          </IconButton>
          <Typography variant="h6">New Match</Typography>
          <Box mr="auto" />
          <Button variant="outlined" color="primary" onClick={handleStartMatch}>
            Start Match
          </Button>
        </Toolbar>
      </AppBar>
      <Box pt="64px" height="calc(100% - 64px)">
        <Box mb="16px">
          <Typography>Players</Typography>
          <Select
            isMulti
            options={users.map(user => ({ value: user.id, label: user.name }))}
            styles={styles}
            onChange={selected => {
              if (Array.isArray(selected)) {
                handleConfigChange('players', selected.map(item => ({ id: item.value, name: item.label })));
              }
            }}
          />
        </Box>
        <Box mb="16px">
          <Typography>Game type</Typography>
          <Box display="flex" mt="8px">
            {[Score.SCORE_301, Score.SCORE_501, Score.SCORE_701].map(score => (
              <Box key={score} mr="16px">
                <SelctableChip
                  selected={score === config.score}
                  onClick={() => handleConfigChange('score', score)}
                  label={score}
                />
              </Box>
            ))}
          </Box>
        </Box>
        <Box mb="16px">
          <Typography>Sets</Typography>
          <Select
            options={[
              SetType.FIRST_TO_1,
              SetType.FIRST_TO_2,
              SetType.FIRST_TO_3,
              SetType.BEST_OF_3,
              SetType.BEST_OF_5,
            ].map(type => ({
              value: type,
              label: type,
            }))}
            value={{ value: config.setType, label: config.setType }}
            styles={styles}
            onChange={selected => {
              if (isOption(selected)) {
                handleConfigChange('setType', selected.value);
              }
            }}
          />
        </Box>
        <Box mb="16px">
          <Typography>Legs</Typography>
          <Select
            options={[
              LegType.FIRST_TO_1,
              LegType.FIRST_TO_2,
              LegType.FIRST_TO_3,
              LegType.BEST_OF_3,
              LegType.BEST_OF_5,
            ].map(type => ({
              value: type,
              label: type,
            }))}
            value={{ value: config.legType, label: config.legType }}
            styles={styles}
            onChange={selected => {
              if (isOption(selected)) {
                handleConfigChange('legType', selected.value);
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
