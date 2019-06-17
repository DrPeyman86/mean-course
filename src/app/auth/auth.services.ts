import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

import { environment } from '../../environments/environment';//environment variables are global variables that can be used throughout the app. So the URL for the server or when you are working locally.

const BACKEND_URL = environment.apiURL + '/user/';

//V6 V6 V6 -- optimziation -- you should not moved services out of root levels because you could have seperate instances of a service. You only want to condense modules into their own files, not services.
@Injectable({ providedIn: "root"})

export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
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

  getUserId() {
    return this.userId;
  }

  //method to create a user from sign up
  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    //V5 V5 V5 -- error handling -- if the user enters a username already taken you want to handle that error.
    //1. you could return the entire http.post() back to where this method was being called from and subscribing to it there rather than here. however that will not be ideal because
    //the redirecting occurs in this service and not in the signup.component.ts.
    //return this.http.post("http://localhost:3000/api/user/signup", authData)//<<<< this would be how you would return the result of the http request back to the component that is was called.

    this.http.post(BACKEND_URL + "/signup", authData)
      .subscribe((response: any)=>{
        this.router.navigate(['/'])
        //console.log(response);
      }, (error)=> {
        //V5 v5 v5 -- error handling -- if the user was not authenticated when creating a user, meaning the username was taken, it would go into the
        //error handling. there we can just set the subject to false, so that any part of the app that is listening to the authStatusListener subjct will know of this. component like signup.component.ts and login.compoenent.ts
        this.authStatusListener.next(false);
      });
  }

  //method to vefify a user
  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    //token will be received from the post() request, so add the generic type <{token: string}> to let angular know what is expected
    this.http.post<{token: string, expiresIn: number, userId: string}>(BACKEND_URL + "/login", authData)
    //V5 v5 v5 -- error handling. one method of fixing the reroute issue is to use the "tab operator"??? which executes before the .subscribe() sort of like a middleware
      .subscribe((response: any)=> {
        //console.log(response);
        const token = response.token;
        this.token = token;

        //only if we receive a token from backend set the authentication flags to true.
        if(token){
          //V3 V3 V3 - user authentication features.
          //add a const to store when the token expires.
          const expiresInDuration = response.expiresIn;
          //console.log('timer: ', this.tokenTimer)
          //the setTimeout will exectute a function, which will call this.logout() after the expiresInDuration is met.
          //store the return NodeJS.Timer type that returns from setTimeout so that it can be used in the clearTimeout() method below in logout() which expects a NodeJS.timer type to be sent as an arugment to clear that timeout timer.
          //the return value of setTimeout is a unique ID that would ID this specific timer. so you may have many timers in one page, and this uniqueID would be set to this.tokenTimer. So that when you clearTimeout() and pass in the timerID uniqueID/
          //the clearTimeout() would know which timeID you are talking about to clear that timer and no other timer.
          //Since we need the following code in a couple places, best to use this inside a method
          // this.tokenTimer = setTimeout(() => {
          //   this.logout();
          //   //console.log('here i am ');
          // }, expiresInDuration * 1000 )//setTimeout works with milliseconds, so convert 3600 to milliseconds by multplying it by 1000. or you could have send back milliseconds from the back-end
          this.setAuthTimer(expiresInDuration);

          //console.log('timer: ', this.tokenTimer)
          this.isAuthenticated = true;

          //V4 V4 V4 -- assign the userId property to the userId coming from back-end
          this.userId = response.userId;

          this.authStatusListener.next(true);//call next() on the method that needs to know of something when the login is complete. so we want to tell authStatusListener that token does exist by passing

          //when the token has been retrieved save the token in local storage by calling .saveAuthData()
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId)
          //in "true" boolean
          this.router.navigate(['/']);
        }

      }, error => {
        //V5 v5 v5 -- eror handling - add here to have the login go into the error handler so that it can call the authStatusListener and set it to false, so that the entire app will know user is not authenticated.
        this.authStatusListener.next(false);
      })
  }

  autoAuthUser() {
    const authInformation = this.getAuthData()
    const now = new Date() ;
    //const isInFuture = authInformation.expirationDate > now;//if the authInformation.expirationDate is in the future, we know the user is still authenticated.
    //since this.setAuthTimer() expects a duration to know how long until the token expires in, we have to determine the difference of time between now until the expirationDate.

    //console.log(authInformation); 
    if(!authInformation){
      return; //if the authInformation does not exist, just return so it will not execute the below lines since they will error out.
    }
    //getDate() will return a duration in milliseconds starting from 01/01/1970, common JS
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    //if the expiresIn is greater than 0, we know that now.GetDate() is a bigger date, which means the expirationDate is still in the future so we should authenticate
    if(expiresIn > 0) {
      this.token = authInformation.token;
      //V4 V4 V4 -- authorization - add the userId if they are logged in and the timer has not expired yet.
      this.userId = authInformation.userId;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);//setTimeout works with milliseconds, so whatever the second is, have to divide by 1000 to get the milliseconds
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false)//send the new information to any listener that is interested in knowing whether a user is authenticated or not. in this case, false, means that user is not authenticated anymore.
    //console.log(this.tokenTimer);

    //V4 V4 V4 -- authorization -- set the userId to null when user logs out so that any component listening will change accordingly.
    this.userId = null;


    clearTimeout(this.tokenTimer)//clearTimeout will clear the timeout unique id that you pass into it from memory
    this.clearAuthData();//run this method to clear the local storage from memory.
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration:number) {
    console.log('setting timer: ' + duration);
    this.tokenTimer = setTimeout(()=>{
      this.logout();
    }, duration * 1000)
  }

  //local Storage is storage managed by browser accessible by javascript therefore vulnerable to cross-site scripting but ANgular prevents against these by default, so we can't output script<> tags with Angular
  //want to save the token and the datetime the token expires in. The date has to be an actual date, which is why expirationDate is of type Date. Because the milliseconds provided by backend is a relative measure from the time
  //it was initilized. If the user refreshes the page and token still exists, we want to know when the original token is going to expire
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);//all local data will be serilized in a localStorage class.
    localStorage.setItem('expiration', expirationDate.toISOString());//toISOString will turn the date into a serilized and stanard style date format
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');//removeItem will clear the local storage items by name
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  //method to get the data from the local storage. only needed in this service, so private.
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    //if either token or expirationDate do not exist, then we know they are not there so return empty
    if(!token || !expirationDate) {
      return;
    }
    //if they do exist, return them
    return {
      token: token,
      expirationDate: new Date(expirationDate),//create a new Date object value based on the serialized string of expirationDate and it will create a new date object from that
      userId: userId
    }
  }
}
