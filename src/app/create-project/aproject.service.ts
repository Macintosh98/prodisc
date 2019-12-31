import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { CommentStmt } from '@angular/compiler';


@Injectable({
  providedIn: 'root'
})

export class AprojectService {
  
  cproject = this.firebase.database.ref('projects')
  
  constructor(private firebase: AngularFireDatabase , private afAuth: AngularFireAuth ) 
  { 
  }

  insertcproject(cproject) : string 
  {  
     let projectKey = this.cproject.push({}).key

     this.cproject.child(projectKey).set({
        name: cproject.name,
        description: cproject.description,
        language: cproject.language,
        platform: cproject.platform,
      });
      
      this.firebase.database.ref(`Users/${this.afAuth.auth.currentUser.uid}`).child(`projects`).push({
        id : projectKey , 
        name : cproject.name
      })

      this.SetToDefault(projectKey)
      return projectKey
  }

  SetToDefault(projectkey)
  { 
    console.log(this.afAuth.auth.currentUser.displayName)

    this.cproject.child(projectkey).child('members').push({
      id : this.afAuth.auth.currentUser.uid ,
      name : this.afAuth.auth.currentUser.displayName
    });

    this.cproject.child(projectkey).child('sketch').child(`coordinates`).set({
      x1: 0 , 
      y1: 0 , 
      x2: 0 , 
      y2: 0 ,
    });

    this.cproject.child(projectkey).child('sketch').child(`status`).set({
      status : 0
    });

    this.cproject.child(projectkey).child('sketch').child(`freehand`).set({
      x1 : 0 ,
      y1 : 0 ,
      x2 : 0 ,
      y2 : 0 
    });

    this.cproject.child(projectkey).child('sketch').child(`attributes`).set({
      color : 'black' ,
      size : 5 ,
      shape : 'point'
    });

  }

  // Display()
  // { 
  //   this.firebase.database.ref('projects').orderByChild('name').equalTo('Gideon').on('value' ,
  //   function(snapshot){
  //     console.log("Display function")
  //     snapshot.forEach(function(snap){
  //         console.log(snap.key)
  //     })
  //   })
  // }
}
