import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, take } from 'rxjs/operators';
import { UserStat } from '../models/userstat.model';
import { Observable } from 'rxjs';
import { ChosenUsers } from '../components/register-match/register-match.component';
import { Match } from '../models/match.model';
import { UtilityService } from './utility.service';
import * as moment from 'moment';

interface CalcUserStat {
  matchesLost: number;
  matchesWon: number;
  points: number;
}

interface TestData {
  id: string;
  name: string;
  seasons: { [key: string]: UserStat };
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(
    private utilityService: UtilityService,
    private db: AngularFirestore,
    private storage: AngularFireStorage) {
    // firebase.firestore.setLogLevel("debug");
  }

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  timestampFromDate(date: Date) {
    return firebase.firestore.Timestamp.fromDate(date);
  }

  get newId(): string {
    return this.db.createId();
  }

  get emptyUserStat(): UserStat {
    return {
      matches: [],
      matchesLost: 0,
      matchesWon: 0,
      points: 0
    };
  }

  getMatches(limit: number = 3) {
    const year = this.utilityService.currentYear;
    return this.db.collection<Match>("matches", (ref) => {
      return ref.where("season", "==", year).orderBy("createdAt", "desc").limit(limit);
    }).valueChanges();
  }

  getRanking(mode: string = "a") {
    const year = this.utilityService.currentYear;
    if (mode === "a") {
      return this.db.collection<User>("users", (ref) => {
        return ref.orderBy(`seasons.${year}.points`, "desc");
      }).valueChanges();
    } else {
      return this.db.collection<User>("users", (ref) => {
        return ref.where("gender", "==", mode).orderBy(`seasons.${year}.points`, "desc");
      }).valueChanges();
    }
  }

  // Modes: w = weeks / d = day
  async getUserChartData(userId: string, mode = "w") {
    const dataObj: { [key: string]: { matches: number, points: number } } = {};
    const matches = await this.getPlayerMatches(userId).toPromise();
    if (matches.length !== 0) {
      for (const match of matches) {
        if (mode === "w") {
          const week = moment((match.matchDate.toDate() as Date)).isoWeek();
          if (week in dataObj) {
            dataObj[week].matches = ++dataObj[week].matches;
            if (match.player1Team1 === userId) {
              dataObj[week].points += match.Player1Team1Points;
            } else if (match.player2Team1 === userId) {
              dataObj[week].points += match.Player2Team1Points;
            } else if ((match.player1Team2 === userId)) {
              dataObj[week].points += match.Player1Team2Points;
            } else if (match.player2Team2 === userId) {
              dataObj[week].points += match.Player2Team2Points;
            }
          } else {
            dataObj[week] = {
              matches: 1,
              points: 0
            };
            if (match.player1Team1 === userId) {
              dataObj[week].points = match.Player1Team1Points;
            } else if (match.player2Team1 === userId) {
              dataObj[week].points = match.Player2Team1Points;
            } else if ((match.player1Team2 === userId)) {
              dataObj[week].points = match.Player1Team2Points;
            } else if (match.player2Team2 === userId) {
              dataObj[week].points = match.Player2Team2Points;
            }
          }
        } else {
          const dateString = moment((match.matchDate.toDate() as Date)).format("DD-MM-YYYY");

          if (dateString in dataObj) {
            dataObj[dateString].matches = ++dataObj[dateString].matches;
            if (match.player1Team1 === userId) {
              dataObj[dateString].points += match.Player1Team1Points;
            } else if (match.player2Team1 === userId) {
              dataObj[dateString].points += match.Player2Team1Points;
            } else if ((match.player1Team2 === userId)) {
              dataObj[dateString].points += match.Player1Team2Points;
            } else if (match.player2Team2 === userId) {
              dataObj[dateString].points += match.Player2Team2Points;
            }
          } else {
            dataObj[dateString] = {
              matches: 1,
              points: 0
            };
            if (match.player1Team1 === userId) {
              dataObj[dateString].points = match.Player1Team1Points;
            } else if (match.player2Team1 === userId) {
              dataObj[dateString].points = match.Player2Team1Points;
            } else if ((match.player1Team2 === userId)) {
              dataObj[dateString].points = match.Player1Team2Points;
            } else if (match.player2Team2 === userId) {
              dataObj[dateString].points = match.Player2Team2Points;
            }
          }
        }
      }

      return dataObj;
    }

    return null;
  }

  getPlayerMatches(userId: string, limit: number = 0) {
    const year = this.utilityService.currentYear;
    return this.db.collection<Match>("matches", (ref) => {
      let returnValue = ref.where("players", "array-contains", userId).where("season", "==", year).orderBy("matchDate");
      if (limit !== 0) {
        returnValue = returnValue.limit(limit);
      }
      return returnValue;
    }).valueChanges().pipe(take(1));
  }

  async addMatch(userId: string, data: ChosenUsers) {
    const id = this.newId;
    const matchDate = this.timestampFromDate(data.matchDate);
    const refsUsers: firebase.firestore.DocumentReference[] = [];
    refsUsers.push(this.db.collection<User>("users").doc(data.player1.id).ref);
    refsUsers.push(this.db.collection<User>("users").doc(data.player2.id).ref);
    refsUsers.push(this.db.collection<User>("users").doc(data.player3.id).ref);
    refsUsers.push(this.db.collection<User>("users").doc(data.player4.id).ref);
    const refMatch = this.db.collection<Match>("matches").doc(id).ref;
    try {
      return this.db.firestore.runTransaction<string>(async (t) => {
        const year = this.utilityService.currentYear;
        const player1UserDoc = await t.get(refsUsers[0]);
        const player2UserDoc = await t.get(refsUsers[1]);
        const player3UserDoc = await t.get(refsUsers[2]);
        const player4UserDoc = await t.get(refsUsers[3]);
        const player1User = (player1UserDoc.data() as User);
        const player2User = (player2UserDoc.data() as User);
        const player3User = (player3UserDoc.data() as User);
        const player4User = (player4UserDoc.data() as User);
        const playerUsers: User[] = [player1User, player2User, player3User, player4User];
        if (!(year in player1User.seasons)) {
          player1User.seasons[year] = this.emptyUserStat;
        }
        if (!(year in player2User.seasons)) {
          player2User.seasons[year] = this.emptyUserStat;
        }
        if (!(year in player3User.seasons)) {
          player3User.seasons[year] = this.emptyUserStat;
        }
        if (!(year in player4User.seasons)) {
          player4User.seasons[year] = this.emptyUserStat;
        }
        const player1UserStat = player1User.seasons[year];
        const player2UserStat = player2User.seasons[year];
        const player3UserStat = player3User.seasons[year];
        const player4UserStat = player4User.seasons[year];
        const playerUserStats: UserStat[] = [player1UserStat, player2UserStat, player3UserStat, player4UserStat];
        const calculatedData = this.calculatePoints(player1UserStat, player2UserStat, player3UserStat, player4UserStat);

        // Add Match
        const matchData: Match = {
          id,
          matchDate,
          active: true,
          createdAt: this.timestamp,
          createdBy: userId,
          player1Team1: data.player1.id,
          player2Team1: data.player2.id,
          player1Team2: data.player3.id,
          player2Team2: data.player4.id,
          players: [data.player1.id, data.player2.id, data.player3.id, data.player4.id],
          winnerTeam: 1,
          Player1Team1Points: calculatedData[0].points,
          Player2Team1Points: calculatedData[1].points,
          Player1Team2Points: calculatedData[2].points,
          Player2Team2Points: calculatedData[3].points,
          season: year
        };
        await t.set(refMatch, matchData);
        // Add Stats to Users
        for (let index = 0; index < calculatedData.length; index++) {
          const calcData = calculatedData[index];
          playerUserStats[index].points = playerUserStats[index].points + calcData.points;
          playerUserStats[index].matchesLost = calcData.matchesLost;
          playerUserStats[index].matchesWon = calcData.matchesWon;
          playerUserStats[index].matches.push(id);
          playerUsers[index].seasons[year] = playerUserStats[index];
          await t.set(refsUsers[index], playerUsers[index]);
        }

        return id;
      });
    } catch (error) {
      console.error("addMatch", error);
      return null;
    }
  }

  private calculatePoints(player1Stats: UserStat, player2Stats: UserStat, player3Stats: UserStat, player4Stats: UserStat): CalcUserStat[] {
    const pointsWonFromLosers = Math.round((player3Stats.points + player4Stats.points) * 0.02);
    return [
      {
        points: 4 + pointsWonFromLosers,
        matchesWon: ++player1Stats.matchesWon,
        matchesLost: player1Stats.matchesLost
      }, {
        points: 4 + pointsWonFromLosers,
        matchesWon: ++player2Stats.matchesWon,
        matchesLost: player2Stats.matchesLost
      }, {
        points: 2,
        matchesWon: player3Stats.matchesWon,
        matchesLost: ++player3Stats.matchesLost
      },
      {
        points: 2,
        matchesWon: player4Stats.matchesWon,
        matchesLost: ++player4Stats.matchesLost
      }
    ];
  }

  async addStatToUser(user: User) {
    try {
      const year = this.utilityService.currentYear;
      user.seasons[year] = this.emptyUserStat;

      await this.db.collection<User>("users").doc(user.id).set(user);
      return user.id;
    } catch (error) {
      console.log("addStatToUser", error);
      return null;
    }
  }

  async addUserProfile(userId: string, name: string, gender: string, photoUrl: string) {
    const year: string = this.utilityService.currentYear.toString();
    const userStat: UserStat = this.emptyUserStat;
    const user: User = {
      id: userId,
      name,
      gender,
      photoUrl,
      seasons: {},
      active: true
    };

    user.seasons[year] = userStat;

    try {
      await this.db.collection<User>("users").doc(userId).set(user);
      return userId;
    } catch (error) {
      console.error("addUserProfile", error);
      return null;
    }
  }

  uploadProfileImage(userId: string, image: string) {
    return new Promise((resolve, reject) => {
      const ref = this.storage.ref(`images/profile_${userId}.png`);
      const task = ref.putString(image, 'data_url', { contentType: 'image/png' });
      task.snapshotChanges().pipe(finalize(async () => {
        try {
          const downloadUrl = await ref.getDownloadURL().toPromise();
          resolve(downloadUrl);
        } catch (error) {
          console.error("uploadProfileImage", error);
          resolve(null);
        }
      })).subscribe();
    });
  }

  async deleteProfileImage(userId: string) {
    const ref = this.storage.ref(`images/profile_${userId}.png`);
    try {
      await ref.getDownloadURL().toPromise();
      await ref.delete().toPromise();
      return userId;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  getUsers(): Observable<User[]> {
    return this.db.collection<User>("users", (ref) => {
      return ref.orderBy("name");
    }).valueChanges();
  }
}
