import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase, snapshotChanges } from 'angularfire2/database'
import { FormBuilder, FormControl , FormGroup} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aboutme',
  templateUrl: './aboutme.component.html',
  styleUrls: ['./aboutme.component.css']
})
export class AboutmeComponent implements OnInit {

  user : any;
  username : string;
  firstname : string;
  lastname : string;
  bio : string;
  email : string;
  skills : any = [];

  edit : boolean = true;
  
  availableTargets = [  {id: 0, name: "C"}, {id: 1, name: "C++"}, {id: 2, name: "Java" },
                        {id: 3, name: "C#"}, {id: 4, name: "Php"}, {id: 5, name: "Python" },
                        {id: 6, name: "Go"}, {id: 7, name: "Ruby"}, {id: 8, name: "Haskel" },
                        {id: 9, name: "Kotlin"}, {id: 10, name: "Html"}, {id: 11, name: "Angular" },
                        {id: 12, name: "Data Structure"},{id: 13, name: "Swift"},{id: 14, name: "Andriod"}
                      ];
  form ;
  constructor(private db: AngularFireDatabase , 
              private afAuth: AngularFireAuth ,
              private formBuilder: FormBuilder , 
              private router: Router){ 
 
      this.db.database.ref(`Users/${this.afAuth.auth.currentUser.uid}`).on('value' , data =>{
        this.user  = data.val()
        this.bio = this.user["bio"]
        this.firstname = this.user["firstname"]
        this.lastname = this.user["lastname"]
        this.email = this.user["email"]
        this.skills = this.user["skills"]
        this.username = this.firstname+"."+this.lastname
      })

      this.form = this.formBuilder.group({
        skills : ['']
      })
  }

  ngOnInit() {
  }

  Edit()
  {
    this.edit = false;
  }

  Update()
  { 
    this.edit = true;
    this.db.database.ref(`Users/${this.afAuth.auth.currentUser.uid}`).update({
      bio : this.bio ,
      skills : this.skills ,
      firstname :  this.firstname , 
      lastname : this.lastname
  })
  }

  DeleteUser()
  { 
    if (confirm("Are you sure you want to delete your account from Prodisx"))
    { 
      this.db.database.ref(`Users/${this.afAuth.auth.currentUser.uid}`).remove()
      this.afAuth.auth.currentUser.delete()
      this.router.navigate(['login']);
    }
  }

  public AddTarget(index) 
  {
    console.log(this.skills)
    for(var i = 0 ; i < this.skills.length ; i++)
    {
      if ( this.skills[i] == this.availableTargets[index].name)
        break;
    }
    if ( i == this.skills.length)
    {
      this.skills.push(this.availableTargets[index].name)
    }
  }
}
