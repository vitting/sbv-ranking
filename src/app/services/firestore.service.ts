import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Userstat } from '../models/userstat.model';
import { Observable } from 'rxjs';
import { ChosenUsers } from '../components/register-match/register-match.component';
import { Match } from '../models/match.model';

interface CalcUserStat {
  matchesLost: number;
  matchesWon: number;
  pointsWon: number;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(
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

  async addMatch(userId: string, data: ChosenUsers) {
    const id = this.newId;
    const matchDate = this.timestampFromDate(data.matchDate);
    const refsStats: firebase.firestore.DocumentReference[] = [];
    const refsUsers: firebase.firestore.DocumentReference[] = [];
    refsStats.push(this.db.collection<Userstat>("userstats").doc(data.player1.id).ref);
    refsStats.push(this.db.collection<Userstat>("userstats").doc(data.player2.id).ref);
    refsStats.push(this.db.collection<Userstat>("userstats").doc(data.player3.id).ref);
    refsStats.push(this.db.collection<Userstat>("userstats").doc(data.player4.id).ref);
    refsUsers.push(this.db.collection<User>("users").doc(data.player1.id).ref);
    refsUsers.push(this.db.collection<User>("users").doc(data.player2.id).ref);
    refsUsers.push(this.db.collection<User>("users").doc(data.player3.id).ref);
    refsUsers.push(this.db.collection<User>("users").doc(data.player4.id).ref);
    const refMatch = this.db.collection<Match>("matches").doc(id).ref;
    try {
      return this.db.firestore.runTransaction<string>(async (t) => {
        const player1Stat = await t.get(refsStats[0]);
        const player2Stat = await t.get(refsStats[1]);
        const player3Stat = await t.get(refsStats[2]);
        const player4Stat = await t.get(refsStats[3]);
        const playerStatPoints: number[] = [];
        playerStatPoints.push((player1Stat.get("pointsWon") as number));
        playerStatPoints.push((player2Stat.get("pointsWon") as number));
        playerStatPoints.push((player3Stat.get("pointsWon") as number));
        playerStatPoints.push((player4Stat.get("pointsWon") as number));
        const player1User = await t.get(refsUsers[0]);
        const player2User = await t.get(refsUsers[1]);
        const player3User = await t.get(refsUsers[2]);
        const player4User = await t.get(refsUsers[3]);
        const playerPoints: number[] = [];
        playerPoints.push((player1User.get("points") as number));
        playerPoints.push((player2User.get("points") as number));
        playerPoints.push((player3User.get("points") as number));
        playerPoints.push((player4User.get("points") as number));

        // tslint:disable-next-line: max-line-length
        const calculatedData = this.calculatePoints((player1Stat.data() as Userstat), (player2Stat.data() as Userstat), (player3Stat.data() as Userstat), (player4Stat.data() as Userstat));
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
          winnerTeam: 1,
          Player1Team1Points: calculatedData[0].pointsWon,
          Player2Team1Points: calculatedData[1].pointsWon,
          Player1Team2Points: calculatedData[2].pointsWon,
          Player2Team2Points: calculatedData[3].pointsWon,
        };
        await t.set(refMatch, matchData);
        for (let index = 0; index < calculatedData.length; index++) {
          const playerData = calculatedData[index];
          await t.update(refsStats[index], {
            matchesLost: playerData.matchesLost,
            matchesWon: playerData.matchesWon,
            pointsWon: playerStatPoints[index] + playerData.pointsWon,
            matches: firebase.firestore.FieldValue.arrayUnion(id)
          });

          await t.update(refsUsers[index], {
            points: playerPoints[index] + playerData.pointsWon
          });
        }

        return id;
      });
    } catch (error) {
      console.error("addMatch", error);
      return null;
    }
  }

  private calculatePoints(player1Stats: Userstat, player2Stats: Userstat, player3Stats: Userstat, player4Stats: Userstat): CalcUserStat[] {
    const pointsWonFromLosers = Math.floor((player3Stats.pointsWon + player4Stats.pointsWon) * 0.02);
    return [
      {
        pointsWon: 4 + pointsWonFromLosers,
        matchesWon: ++player1Stats.matchesWon,
        matchesLost: player1Stats.matchesLost
      }, {
        pointsWon: 4 + pointsWonFromLosers,
        matchesWon: ++player2Stats.matchesWon,
        matchesLost: player2Stats.matchesLost
      }, {
        pointsWon: 2,
        matchesWon: player3Stats.matchesWon,
        matchesLost: ++player3Stats.matchesLost
      },
      {
        pointsWon: 2,
        matchesWon: player4Stats.matchesWon,
        matchesLost: ++player4Stats.matchesLost
      }
    ];
  }

  async addUserProfile(userId: string, name: string, gender: string, photoUrl: string) {
    const user: User = {
      id: userId,
      name,
      gender,
      photoUrl,
      points: 0,
      active: true
    };

    try {
      await this.db.collection<User>("users").doc(userId).set(user);
      return userId;
    } catch (error) {
      console.error("addUserProfile", error);
      return null;
    }
  }

  async addUserStat(userId: string) {
    const userStat: Userstat = {
      id: userId,
      matches: [],
      matchesLost: 0,
      matchesWon: 0,
      pointsWon: 0,
      active: true
    };

    try {
      await this.db.collection<Userstat>("userstats").doc(userId).set(userStat);
      return userId;
    } catch (error) {
      console.error("addUserStat", error);
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

  getUserStats(): Observable<Userstat[]> {
    return this.db.collection<Userstat>("userstats").valueChanges();
  }
}
