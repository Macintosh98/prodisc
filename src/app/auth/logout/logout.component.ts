import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  authError: any;

  constructor(private auth: AuthService) { 
    this.auth.logout();
  }

  ngOnInit() {
    this.auth.eventAuthError$.subscribe( data => {
      this.authError = data;
    });
  }


}
