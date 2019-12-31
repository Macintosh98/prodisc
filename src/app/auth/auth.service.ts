import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';
import { BehaviorSubject } from 'rxjs';
import { AngularFireDatabase, snapshotChanges } from 'angularfire2/database'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private eventAuthError = new BehaviorSubject<string>("");
  eventAuthError$ = this.eventAuthError.asObservable();
  newUser: any;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private db1: AngularFireDatabase,
    private router: Router) { }

  getUserState() {
    return this.afAuth.authState;
  }

  login( email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .catch(error => {
        this.eventAuthError.next(error);
      })
      .then(userCredential => {
        if(userCredential) {
          this.router.navigate(['profile']);
        }
      })
  }

  createUser(user) {
    this.afAuth.auth.createUserWithEmailAndPassword( user.email, user.password)
      .then( userCredential => {
        this.newUser = user;
        userCredential.user.updateProfile( {
          displayName: user.firstName ,
        });

        this.insertUserData(userCredential)
          .then(() => {
            this.router.navigate(['profile']);
          });
      })
      .catch( error => {
        this.eventAuthError.next(error);
      });
  }

  insertUserData(userCredential: firebase.auth.UserCredential) {
    
    return this.db1.database.ref(`Users/${userCredential.user.uid}`).set({
      email: this.newUser.email,
      firstname: this.newUser.firstName,
      lastname: this.newUser.lastName,
      bio: this.newUser.bio,
      skills:this.newUser.skills 
    })
  }

  logout() {
    this.router.navigate(['']);
    return this.afAuth.auth.signOut();
  }
}
