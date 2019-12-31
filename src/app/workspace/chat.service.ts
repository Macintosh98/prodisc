import { Injectable } from '@angular/core';
import { AngularFireDatabase, ChildEvent, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { ChatMessage } from '../models/chat-message.model';
import * as firebase from 'firebase/app';
import { DataService } from '../services/data.service';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  user: firebase.User;
  chatMessages:  any;
  chatMessage: ChatMessage;
  username: string;
  m:any;
  path:any;
  projectKey:any;

  constructor(  private db: AngularFireDatabase,
                private data : DataService ,
                private afAuth: AngularFireAuth) {
                
            console.log('I am Chat Service')
            this.data.currentMessage$.subscribe(message => {
            this.projectKey = message;
            this.path = 'projects/'+this.projectKey+'/'+'chat';
            this.chatMessages = this.db.list(this.path).valueChanges();
    });

  }


  sendMessage(msg: string) {
    
    const timestamp = this.getTimeStamp();
    this.getUser()
    this.db.list(this.path).push({
          message: msg,
          timeSent: timestamp,
          userName: this.username
      });        
  }

  getMessages(): any{
    return this.chatMessages;
  }

  getTimeStamp() {
    let now = new Date;
 
    const time = now.getHours() + ':' +
                 now.getMinutes()
    return (time);
  }

  getUser() {
    
      this.db.database.ref(`Users/${this.afAuth.auth.currentUser.uid}`).on('value' , data =>{
      this.username  = data.val()['firstname']
    })
  }

}


