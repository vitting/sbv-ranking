import { UserStat } from './userstat.model';

export interface User {
  id: string;
  name: string;
  gender: string;
  photoUrl: string;
  active: boolean;
  seasons: {[key: string]: UserStat};
}
