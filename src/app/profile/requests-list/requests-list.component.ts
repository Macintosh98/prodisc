import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.css']
})
export class RequestsListComponent implements OnInit {

  requestedProject = [];
  projectInfo : any;
  memberCount : any;
  
  constructor(private db: AngularFireDatabase , private afAuth: AngularFireAuth,) {
  }

  ngOnInit() {

    this.db.list(`Users/${this.afAuth.auth.currentUser.uid}/requests`).snapshotChanges().subscribe(
      list => {
        this.requestedProject = list.map(item => {
          return {
            $key: item.key,
            ...item.payload.val()
          };
        });
      });
  }

  Accept(requestKey , index)
  {     
    this.db.database.ref(`Users/${this.afAuth.auth.currentUser.uid}/projects`).push({
      id : this.requestedProject[index]['projectId'] , 
      name : this.requestedProject[index]['name'] ,
      description : this.requestedProject[index]['description']
    })
    
    this.db.database.ref(`projects`).child(this.requestedProject[index]['projectId']).child('members').push({
      id : this.afAuth.auth.currentUser.uid ,
      name : this.afAuth.auth.currentUser.displayName
    });

    this.db.database.ref(`Users/${this.afAuth.auth.currentUser.uid}/requests`).child(requestKey).remove();
  }

  Decline(requestKey)
  {
    this.db.database.ref(`Users/${this.afAuth.auth.currentUser.uid}/requests`).child(requestKey).remove();
  }

  Details(index)
  {
    this.db.database.ref(`projects`).child(this.requestedProject[index]['projectId']).on("value" , snap => {
        this.projectInfo = snap.val()
    })

    this.db.database.ref(`projects`).child(this.requestedProject[index]['projectId']).child('members').once('value', snap => {
      this.memberCount = snap.numChildren()
    });
  }
}
