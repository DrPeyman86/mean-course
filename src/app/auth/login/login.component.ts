import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

//if you know your component does have routing, which is the "Router" module from angular, then you do not need a selector property in the @Component
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  isLoading = false;


  onLogin(form: NgForm) {
    if (!form.valid) {
      return false;
    }
    //console.log(form.value);
  }

}
