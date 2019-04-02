import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from '../auth/auth.services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    //without the line below, the header component will have issue loading whether a user is authenticated or not. because we are listening to updates to authentication status but if this components
    //gets initialized a little bit too late, which is high chance of that since we do kick off the authentication workflow in the app.components.ts which loads first and we get that synchronously so all
    //the code in authService.authAuthUser() executes pretty quickly we get that information before the header is loaded. so beside setting up the listener here, we need to set the local property to whatever
    //authService.getIsAuth() returns
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated)=>{
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {

  }
}
