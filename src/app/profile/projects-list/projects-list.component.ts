import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, ChildEvent, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {

  myprojects = [];

  constructor(private db: AngularFireDatabase ,
              private afAuth: AngularFireAuth,
              private router: Router){
  }

  ngOnInit() { 
    this.db.list(`Users/${this.afAuth.auth.currentUser.uid}/projects`).snapshotChanges().subscribe(
      list => {
        this.myprojects = list.map(item => {
          return {
            $key: item.key,
            ...item.payload.val()
          };
        });
        console.log(this.myprojects)
      });
  }

  Go(projectKey)
  {
    this.router.navigate(['workspace'] , { queryParams:{ id : projectKey}})
  }
}
