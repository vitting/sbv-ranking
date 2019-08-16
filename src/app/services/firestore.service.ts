import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

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

  get newId(): string {
    return this.db.createId();
  }

  async addUserProfile(userId: string, name: string, gender: string, photoUrl: string) {
    const user: User = {
      id: userId,
      name,
      gender,
      photoUrl,
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

  uploadProfileImage(userId: string, image: string) {
    return new Promise((resolve, reject) => {
      const ref = this.storage.ref(`images/profile_${userId}.png`);
      const task = ref.putString(image, 'data_url', { contentType: 'image/png' });
      task.snapshotChanges().pipe(finalize(async () => {
        try {
          const downloadUrl = await ref.getDownloadURL().toPromise();
          resolve(downloadUrl);
        } catch (error) {
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
}
