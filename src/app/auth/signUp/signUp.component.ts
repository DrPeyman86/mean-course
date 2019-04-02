import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.services';
import { Subscription } from 'rxjs';

//if you know your component does have routing, which is the "Router" module from angular, then you do not need a selector property in the @Component
@Component({
  templateUrl: './signUp.component.html',
  styleUrls: ['./signUp.component.css']
})

export class SignUpComponent implements OnInit, OnDestroy {
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


  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
    //console.log(form.value);

    //v5 v5 v5 - error handling -- if you want to subscribe to the observable here rather than in the service. subscribe to it here. 
    //however this will not be ideal because the routing is handled in the auth.service.ts and not here, so you would want to do as much as you can in auth.service.ts. 
    //this.authService.createUser(form.value.email, form.value.password).subscribe(null, error=>{console.log(error) this.isLoading = false})

    //V5 V5 v5 -- better solution
  }

  ngOnDestroy() {
    //V5 V5 v5 -- better solution -- unsubscribe to the subject so that it will get 
    this.authStatusSub.unsubscribe();
  }

}
