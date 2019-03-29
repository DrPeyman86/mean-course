import { CanActivate, Router } from '@angular/router';//CanActivate is the interface that allows you protect routes
import { ActivatedRouteSnapshot,RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.services';


@Injectable()//have to add the injectable keyword decorator because this service wants some data from some other service. so the service that wants something is the service that needs the @Injectable

//this is a router-guard that angular also provides as part of the "router" framework.
//guards are basically interfaces where the router guard will execute before a router is implemented. So if you are using router framwork and you click on a button that goes to a route,
//this interface router guard will execute first. kind of like a middleware.
export class AuthGuard implements CanActivate {
  //add the authService service to be able to call a method of that.
  //add the Router type to be able to call .navigate.
  constructor(private authService: AuthService, private router: Router){}
  //this canActivate returns either a boolean, an Observable Boolean, or a Promise boolean. Because the only thing we need from router guards is whether the route should be allowed to go through or not, so just boolean
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {
    //throw new Error("Method not implemented.");
    const isAuth = this.authService.getIsAuth();//call the getIsAuth method to see if current user is authenticated.
    if (!isAuth) {
      this.router.navigate(['./login']);//if not authenticated, any requests to page they make, send them back to the login page to have them login again
    }
    return isAuth;//return the boolean of whether user is authenticated or not
  }

}
