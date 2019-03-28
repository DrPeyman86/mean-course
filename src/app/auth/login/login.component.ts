import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.services';

//if you know your component does have routing, which is the "Router" module from angular, then you do not need a selector property in the @Component
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  isLoading = false;
  constructor (public authService: AuthService){}

  onLogin(form: NgForm) {
    if (!form.valid) {
      return false;
    }
    this.authService.login(form.value.email, form.value.password);
    //console.log(form.value);
  }

}
