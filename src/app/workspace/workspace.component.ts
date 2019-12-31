import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { AngularFireDatabase, snapshotChanges } from 'angularfire2/database'
import { combineAll } from 'rxjs/operators';


@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {

  projectKey : any;
  projectInformation : any;
  memberCount : any;

  constructor(private router: Router ,
              private route : ActivatedRoute ,
              private data : DataService ,
              private db: AngularFireDatabase ){
   } 

  ngOnInit() {
    this.route.queryParams.subscribe((params) => this.projectKey = params['id'])
    this.data.sendMessage(this.projectKey)
    this.getDetails()
  }

  getDetails()
  {
    let path = 'projects/'+this.projectKey
    this.db.database.ref(path).once('value' , snap => {
        this.projectInformation = snap.val()
    })

    this.db.database.ref(path).child('members').once('value', snap => {
      this.memberCount = snap.numChildren()
    });
  }

}
