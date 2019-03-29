import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: "root"})

export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: NodeJS.Timer;
  private authStatusListener = new Subject<boolean>();//the authStatusListener will be injected to any component that is interested in knowing whether the token exists or does not exist or if it changed. so
  //just need it to be a boolean.


  constructor(private http: HttpClient, private router: Router){}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();//just return it as an observable when this method is called.
  }

  //method to create a user from sign up
  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe((response: any)=>{
        console.log(response);
      });
  }

  //method to vefify a user
  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    //token will be received from the post() request, so add the generic type <{token: string}> to let angular know what is expected
    this.http.post<{token: string, expiresIn: number}>("http://localhost:3000/api/user/login", authData)
      .subscribe((response: any)=> {
        //console.log(response);
        const token = response.token;
        this.token = token;

        //only if we receive a token from backend set the authentication flags to true.
        if(token){
          //V3 V3 V3 - user authentication features.
          //add a const to store when the token expires.
          const expiresInDuration = response.expiresIn;
          console.log('timer: ', this.tokenTimer)
          //the setTimeout will exectute a function, which will call this.logout() after the expiresInDuration is met.
          //store the return NodeJS.Timer type that returns from setTimeout so that it can be used in the clearTimeout() method below in logout() which expects a NodeJS.timer type to be sent as an arugment to clear that timeout timer.
          //the return value of setTimeout is a unique ID that would ID this specific timer. so you may have many timers in one page, and this uniqueID would be set to this.tokenTimer. So that when you clearTimeout() and pass in the timerID uniqueID/
          //the clearTimeout() would know which timeID you are talking about to clear that timer and no other timer.
          this.tokenTimer = setTimeout(() => {
            this.logout();
            //console.log('here i am ');
          }, expiresInDuration)//setTimeout works with milliseconds, so convert 3600 to milliseconds by multplying it by 1000. or you could have send back milliseconds from the back-end
          console.log('timer: ', this.tokenTimer)
          this.isAuthenticated = true;
          this.authStatusListener.next(true);//call next() on the method that needs to know of something when the login is complete. so we want to tell authStatusListener that token does exist by passing
          //in "true" boolean
          this.router.navigate(['/']);
        }

      })
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false)//send the new information to any listener that is interested in knowing whether a user is authenticated or not. in this case, false, means that user is not authenticated anymore.
    //console.log(this.tokenTimer);
    clearTimeout(this.tokenTimer)//clearTimeout will
    this.router.navigate(['/']);
  }

}
