import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, Observer, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: firebase.User;
  Created : boolean = false;
  url : any
  status : boolean = false

  constructor(private auth: AuthService ,
              private db: AngularFireDatabase,
              private afAuth: AngularFireAuth 
            ){
              console.log("Checking Network Connection")
              this.createOnline$().subscribe(isOnline => this.status = isOnline);
             }

  ngOnInit() {
    this.auth.getUserState()
      .subscribe( user => {
        this.user = user
      })
  }

  createOnline$() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }
}
