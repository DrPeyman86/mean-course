import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.services';
import { Subscription } from 'rxjs';

//if you know your component does have routing, which is the "Router" module from angular, then you do not need a selector property in the @Component
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy  {
  isLoading = false;
  private authStatusSub: Subscription;
  constructor(public authService: AuthService){}

  //V5 v5 v5 -- error handling - rather than subscribing to the observable from .createUser(), we want to subscribe to the getAuthStatusListener() because 
  //in there a subject is returned which any component can use inside that component if they are interested. and with subjects, you can subscribe and unsubscribe() to destruct the subject when you 
  //leave the component. 
  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      //the getAuthStatusListener will get back an observable so we subscribe. we get back a value from that which we can name authStatus. 
      //if the getAuthStatusListener inside auth.services.ts is set to (false) this will set this.isLoading to false. 
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onLogin(form: NgForm) {
    if (!form.valid) {
      return false;
    }
    this.authService.login(form.value.email, form.value.password);
    //console.log(form.value);
  }

  ngOnDestroy() {
    //V5 V5 v5 -- better solution -- unsubscribe to the subject so that it will get 
    this.authStatusSub.unsubscribe();
  }

}
