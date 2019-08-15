import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private db: AngularFirestore) {
    // firebase.firestore.setLogLevel("debug");
  }

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  get newId(): string {
    return this.db.createId();
  }
}
