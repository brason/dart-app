export interface User {
  id: string;
  name: string;
}

export enum SetType {
  NO_SETS = 'No Sets',
  BEST_OF_3 = 'Best of 3',
  BEST_OF_5 = 'Best of 5',
  FIRST_TO_1 = 'First to 1',
  FIRST_TO_2 = 'First to 2',
  FIRST_TO_3 = 'First to 3',
}

export enum LegType {
  BEST_OF_3 = 'Best of 3',
  BEST_OF_5 = 'Best of 5',
  FIRST_TO_1 = 'First to 1',
  FIRST_TO_2 = 'First to 2',
  FIRST_TO_3 = 'First to 3',
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
