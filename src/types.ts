import { firestore } from 'firebase';

export enum ArrowState {
  SINGLE,
  DOUBLE,
  TRIPLE,
}

export interface Arrow {
  value: number;
  state: ArrowState;
}

export interface User {
  id: string;
  name: string;
}

export interface Player extends User {
  score: number;
  setsWon: number;
  legsWon: number;
}

export interface Match {
  id: string;
  players: Player[];
  currentPlayerIndex: number;
  currentSet: number;
  currentLeg: number;
  score: Score;
  setType: SetType;
  legType: LegType;
  startedAt: firestore.Timestamp;
  concluded: boolean;
  history: { player: Player; arrows: Arrow[] }[];
}

export enum SetType {
  FIRST_TO_1 = 'First to 1',
  FIRST_TO_2 = 'First to 2',
  FIRST_TO_3 = 'First to 3',
  BEST_OF_3 = 'Best of 3',
  BEST_OF_5 = 'Best of 5',
}

export enum LegType {
  FIRST_TO_1 = 'First to 1',
  FIRST_TO_2 = 'First to 2',
  FIRST_TO_3 = 'First to 3',
  BEST_OF_3 = 'Best of 3',
  BEST_OF_5 = 'Best of 5',
}

export enum Score {
  SCORE_301 = 301,
  SCORE_501 = 501,
  SCORE_701 = 701,
}

export interface Config {
  players: User[];
  setType: SetType;
  legType: LegType;
  score: Score;
}
