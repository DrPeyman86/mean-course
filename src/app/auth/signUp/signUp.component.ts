import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.services';

//if you know your component does have routing, which is the "Router" module from angular, then you do not need a selector property in the @Component
@Component({
  templateUrl: './signUp.component.html',
  styleUrls: ['./signUp.component.css']
})

export class SignUpComponent {
  isLoading = false;

  constructor(public authService: AuthService){}


  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
    //console.log(form.value);
  }

}
