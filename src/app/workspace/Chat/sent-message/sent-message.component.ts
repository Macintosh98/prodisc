import { Component } from '@angular/core';
// import { ChatService } from '../../chat.service';
import { ChatService } from '../../chat.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-sent-message',
  templateUrl: './sent-message.component.html',
  styleUrls: ['./sent-message.component.css']
})
export class SentMessageComponent {
  feed: any;

  constructor( private chat:ChatService ,
              private data:DataService  ){
          
          // It is an observable which keep eye on received messages. As soon as message is received it is been displayed
          this.data.currentMessage$.subscribe(message=>{
              this.feed=this.chat.getMessages();
        })
  }
}
