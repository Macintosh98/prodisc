import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder , Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  authError: any;
  showSuccessMessage: boolean;
  loginForm ;
  submitted : boolean;

  constructor(private auth: AuthService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })

    this.auth.eventAuthError$.subscribe( data => {
      alert(data)
      // this.authError = data;
      // if(this.authError)
      //   this.showSuccessMessage = true;
      // setTimeout(() => this.showSuccessMessage = false, 3000);
    });
  }

  login(frm) {
    this.submitted = true
    this.auth.login(frm.value.email, frm.value.password);
  }

  get f() { return this.loginForm.controls; }

}
