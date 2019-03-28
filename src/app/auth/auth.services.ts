import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: "root"})

export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();//the authStatusListener will be injected to any component that is interested in knowing whether the token exists or does not exist or if it changed. so 
  //just need it to be a boolean.


  constructor(private http: HttpClient){}

  getToken() {
    return this.token;
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
    this.http.post<{token: string}>("http://localhost:3000/api/user/login", authData)
      .subscribe((response: any)=> {
        //console.log(response);
        const token = response.token;
        this.token = token;

        this.authStatusListener.next(true);//call next() on the method that needs to know of something when the login is complete. so we want to tell authStatusListener that token does exist by passing 
        //in "true" boolean
      })
  }

}
